// Copyright (c) 2015 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/* global Image, HTMLCanvasElement */
import GL from '@luma.gl/constants';
import { Layer } from '@deck.gl/core';
import { Model, Geometry, Texture2D, fp64 } from 'luma.gl';
import { loadImage } from '@loaders.gl/core';
import vs from './bitmap-layer-vertex';
import shaderTemplate from './bitmap-layer-fragment';

const { fp64LowPart } = fp64;

const defaultProps = {
  image: null,
  bitmapBounds: { type: 'array', value: [1, 0, 0, 1], compare: true },
  fp64: false,

  desaturate: { type: 'number', min: 0, max: 1, value: 0 },
  // More context: because of the blending mode we're using for ground imagery,
  // alpha is not effective when blending the bitmap layers with the base map.
  // Instead we need to manually dim/blend rgb values with a background color.
  transparentColor: { type: 'color', value: [0, 0, 0, 0] },
  tintColor: { type: 'color', value: [255, 255, 255] }
};

/*
 * @class
 * @param {object} props
 * @param {number} props.transparentColor - color to interpret transparency to
 * @param {number} props.tintColor - color bias
 */
export default class BitmapLayer extends Layer {
  getShaders() {
    const projectModule = this.use64bitProjection() ? 'project64' : 'project32';

    const fs = shaderTemplate
      .replace('{decodeParams}', Object.keys(this.props.decodeParams).map(p => `uniform float ${p};`).join(' '))
      .replace('{decodeFunction}', this.props.decodeFunction || '');

    return { vs, fs, modules: [projectModule, 'picking'] };
  }

  initializeState() {
    const attributeManager = this.getAttributeManager();
    /*
      -1,1  ---  1,1
        |         |
      -1,-1 --- 1,-1
     */
    const positions = [-1, -1, 0, -1, 1, 0, 1, 1, 0, 1, -1, 0];

    attributeManager.add({
      positions: {
        size: 3,
        update: this.calculatePositions,
        value: new Float32Array(positions)
      },
      positions64xyLow: {
        size: 3,
        update: this.calculatePositions64xyLow,
        value: new Float32Array(positions)
      }
    });
  }

  updateState({ props, oldProps }) {
    // setup model first
    if (props.fp64 !== oldProps.fp64) {
      const { gl } = this.context;
      if (this.state.model) {
        this.state.model.delete();
      }
      this.setState({ model: this._getModel(gl) });
      this.getAttributeManager().invalidateAll();
    }

    if (props.image !== oldProps.image) {
      this.loadTexture();
    }

    const attributeManager = this.getAttributeManager();

    if (props.bitmapBounds !== oldProps.bitmapBounds) {
      this.setState({
        positions: this._getPositionsFromBounds(props.bitmapBounds)
      });
      attributeManager.invalidate('positions');
      attributeManager.invalidate('positions64xyLow');
    }
  }

  _getPositionsFromBounds(bitmapBounds) {
    const positions = new Array(12);
    // bitmapBounds as [minX, minY, maxX, maxY]
    if (Number.isFinite(bitmapBounds[0])) {
      /*
        (minX0, maxY3) ---- (maxX2, maxY3)
               |                  |
               |                  |
               |                  |
        (minX0, minY1) ---- (maxX2, minY1)
     */
      positions[0] = bitmapBounds[0];
      positions[1] = bitmapBounds[1];
      positions[2] = 0;

      positions[3] = bitmapBounds[0];
      positions[4] = bitmapBounds[3];
      positions[5] = 0;

      positions[6] = bitmapBounds[2];
      positions[7] = bitmapBounds[3];
      positions[8] = 0;

      positions[9] = bitmapBounds[2];
      positions[10] = bitmapBounds[1];
      positions[11] = 0;
    } else {
      // [[minX, minY], [minX, maxY], [maxX, maxY], [maxX, minY]]
      for (let i = 0; i < bitmapBounds.length; i++) {
        positions[i * 3 + 0] = bitmapBounds[i][0];
        positions[i * 3 + 1] = bitmapBounds[i][1];
        positions[i * 3 + 2] = bitmapBounds[i][2] || 0;
      }
    }

    return positions;
  }

  _getModel(gl) {
    if (!gl) {
      return null;
    }

    /*
      0,1 --- 1,1
       |       |
      0,0 --- 1,0
    */
    return new Model(
      gl,
      Object.assign({}, this.getShaders(), {
        id: this.props.id,
        shaderCache: this.context.shaderCache,
        geometry: new Geometry({
          drawMode: GL.TRIANGLE_FAN,
          vertexCount: 4,
          attributes: {
            texCoords: new Float32Array([0, 0, 0, 1, 1, 1, 1, 0])
          }
        }),
        isInstanced: false
      })
    );
  }

  draw({ uniforms }) {
    const { bitmapTexture, model } = this.state;
    const { desaturate, transparentColor, tintColor, zoom, decodeParams, opacity } = this.props;

    // TODO fix zFighting
    // Render the image
    if (bitmapTexture && model) {
      model.render(
        Object.assign({}, uniforms, {
          bitmapTexture,
          desaturate,
          transparentColor,
          tintColor,
          zoom,
          ...decodeParams,
          opacity
        })
      );
    }
  }

  loadTexture() {
    const { gl } = this.context;
    const { image } = this.props;

    const textureOptions = {
      parameters: {
        [GL.TEXTURE_MIN_FILTER]: GL.NEAREST,
        [GL.TEXTURE_MAG_FILTER]: GL.NEAREST,
        [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
        [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE,
      },
      mipmaps: false
    };

    if (typeof image === 'string') {
      loadImage(image).then((data) => {
        this.setState({
          bitmapTexture: new Texture2D(gl, {
            data,
            ...textureOptions
          })
        });
      })
      .catch(e => {
        console.warn(e);
      });
    } else if (image instanceof Texture2D) {
      this.setState({ bitmapTexture: image });
    } else if (
      // browser object
      image instanceof Image
      || image instanceof HTMLCanvasElement
    ) {
      this.setState({
        bitmapTexture: new Texture2D(gl, {
          data: image,
          ...textureOptions
        })
      });
    }
  }

  calculatePositions({ value }) {
    const { positions } = this.state;
    value.set(positions);
  }

  calculatePositions64xyLow(attribute) {
    const isFP64 = this.use64bitPositions();
    attribute.constant = !isFP64;

    if (!isFP64) {
      attribute.value = new Float32Array(4);
      return;
    }

    const { value } = attribute;
    value.set(this.state.positions.map(fp64LowPart));
  }
}

BitmapLayer.layerName = 'BitmapLayer';
BitmapLayer.defaultProps = defaultProps;
