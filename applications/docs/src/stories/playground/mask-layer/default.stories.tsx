
import React, { useCallback, useState } from 'react';
import { Story } from '@storybook/react/types-6-0';
// Layer manager
import { LayerManager, Layer, LayerProps } from '@vizzuality/layer-manager-react';
import PluginMapboxGl from '@vizzuality/layer-manager-plugin-mapboxgl';
import CartoProvider from '@vizzuality/layer-manager-provider-carto';

import GL from '@luma.gl/constants';
import { TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer, GeoJsonLayer, ScatterplotLayer } from '@deck.gl/layers';
import { MaskExtension } from '@deck.gl/extensions';
import {CSVLoader} from '@loaders.gl/csv';

const PORTUGAL_GEOJSON = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"scalerank":1,"featurecla":"Admin-0 country","labelrank":2,"sovereignt":"Portugal","sov_a3":"PRT","adm0_dif":0,"level":2,"type":"Sovereign country","admin":"Portugal","adm0_a3":"PRT","geou_dif":0,"geounit":"Portugal","gu_a3":"PRT","su_dif":1,"subunit":"Portugal","su_a3":"PR1","brk_diff":0,"name":"Portugal","name_long":"Portugal","brk_a3":"PR1","brk_name":"Portugal","brk_group":null,"abbrev":"Port.","postal":"P","formal_en":"Portuguese Republic","formal_fr":null,"note_adm0":null,"note_brk":null,"name_sort":"Portugal","name_alt":null,"mapcolor7":1,"mapcolor8":7,"mapcolor9":1,"mapcolor13":4,"pop_est":10707924,"gdp_md_est":208627,"pop_year":-99,"lastcensus":2011,"gdp_year":0,"economy":"2. Developed region: nonG7","income_grp":"1. High income: OECD","wikipedia":-99,"fips_10":null,"iso_a2":"PT","iso_a3":"PRT","iso_n3":"620","un_a3":"620","wb_a2":"PT","wb_a3":"PRT","woe_id":-99,"adm0_a3_is":"PRT","adm0_a3_us":"PRT","adm0_a3_un":-99,"adm0_a3_wb":-99,"continent":"Europe","region_un":"Europe","subregion":"Southern Europe","region_wb":"Europe & Central Asia","name_len":8,"long_len":8,"abbrev_len":5,"tiny":-99,"homepart":1,"filename":"PRT.geojson"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-17.190869140624926,32.868603515624976],[-17.054492187499932,32.81586914062498],[-16.92919921875,32.84140625000003],[-16.77397460937499,32.77353515624998],[-16.693261718749966,32.75800781250001],[-16.765283203124994,32.70971679687503],[-16.837402343749943,32.648291015625034],[-17.018261718749926,32.66279296874998],[-17.17119140624999,32.721875],[-17.226025390624983,32.76684570312503],[-17.241015625000017,32.80737304687503],[-17.190869140624926,32.868603515624976]]],[[[-25.02734375,36.95996093750003],[-25.03154296874999,36.94155273437502],[-25.08837890625,36.948876953124994],[-25.15991210937503,36.94335937500003],[-25.198388671874934,36.99653320312501],[-25.163525390624955,37.01855468749997],[-25.082910156249966,37.02402343750003],[-25.044335937499994,37.00019531249998],[-25.02734375,36.95996093750003]]],[[[-25.648974609374985,37.84091796875],[-25.585498046874932,37.83403320312502],[-25.2666015625,37.84863281249997],[-25.18193359374996,37.837890625],[-25.19072265624999,37.764355468749955],[-25.251123046874937,37.73500976562502],[-25.43901367187493,37.71533203125],[-25.73447265624992,37.76289062500001],[-25.833691406249983,37.82607421874999],[-25.847851562499923,37.872412109375034],[-25.84589843749998,37.89404296875],[-25.783740234375014,37.9111328125],[-25.648974609374985,37.84091796875]]],[[[-28.14726562499996,38.45268554687502],[-28.064794921875034,38.412744140624966],[-28.18974609374999,38.404150390625006],[-28.231152343749983,38.384667968750016],[-28.33242187500002,38.41289062500002],[-28.45449218750002,38.40864257812504],[-28.53115234374999,38.462548828124994],[-28.54882812499997,38.51855468750003],[-28.51025390625,38.553027343750045],[-28.402148437500014,38.55336914062502],[-28.14726562499996,38.45268554687502]]],[[[-28.641308593749983,38.525],[-28.74384765624998,38.52236328125002],[-28.842041015625,38.5984375],[-28.697753906249996,38.638476562500045],[-28.65541992187499,38.614062500000045],[-28.624218749999955,38.58632812499999],[-28.605810546875034,38.55073242187501],[-28.641308593749983,38.525]]],[[[-27.778466796874966,38.55561523437504],[-27.825878906249923,38.54355468749998],[-28.09233398437496,38.62055664062504],[-28.18725585937503,38.65537109375003],[-28.310644531250002,38.74389648437503],[-27.962646484375,38.63632812500006],[-27.778466796874966,38.55561523437504]]],[[[-27.075244140624957,38.643457031249994],[-27.09531249999995,38.63403320312503],[-27.30283203124995,38.66103515625002],[-27.361914062500006,38.69785156250006],[-27.38593750000001,38.765820312499955],[-27.35102539062501,38.788964843749966],[-27.259667968749966,38.80268554687501],[-27.127001953125017,38.78984374999995],[-27.04194335937501,38.7412109375],[-27.041992187500025,38.67890625000001],[-27.075244140624957,38.643457031249994]]],[[[-31.137109374999937,39.40693359375001],[-31.18134765624998,39.35893554687502],[-31.25761718749999,39.3759765625],[-31.282958984375,39.39409179687496],[-31.26083984375003,39.49677734375001],[-31.199853515624937,39.520849609375034],[-31.13862304687498,39.479443359374955],[-31.137109374999937,39.40693359375001]]],[[[-8.173535156249955,41.819970703124994],[-8.152490234374937,41.81196289062498],[-8.094433593749926,41.81420898437499],[-7.990966796874972,41.851904296875034],[-7.920849609374982,41.883642578125],[-7.896386718749994,41.87055664062501],[-7.693066406249955,41.88847656250002],[-7.644677734374937,41.87397460937498],[-7.612597656249988,41.85795898437502],[-7.512597656249966,41.83598632812498],[-7.40361328124996,41.83369140624995],[-7.268554687499972,41.864404296874994],[-7.209619140624966,41.89526367187497],[-7.198339843749978,41.92939453125001],[-7.195361328124989,41.95522460937502],[-7.177929687499983,41.9716796875],[-7.147119140625023,41.98115234374998],[-7.09912109375,41.964208984375006],[-7.030468749999955,41.95063476562498],[-6.865527343749932,41.945263671874955],[-6.833203124999926,41.96416015624999],[-6.777294921874983,41.958496093749964],[-6.70361328125,41.9345703125],[-6.61826171874992,41.9423828125],[-6.575341796874966,41.91308593749997],[-6.557519531249966,41.874121093750034],[-6.552587890624948,41.78955078125003],[-6.558984375000023,41.70405273437501],[-6.542187499999954,41.672509765624994],[-6.48466796874996,41.664404296875034],[-6.391699218749949,41.66538085937503],[-6.308056640624954,41.642187500000034],[-6.243115234374955,41.60180664062497],[-6.221679687499943,41.560449218749994],[-6.2125,41.53203125],[-6.244335937499955,41.51591796874995],[-6.28935546874996,41.45502929687501],[-6.403125,41.37539062500002],[-6.56591796875,41.3037109375],[-6.690136718749983,41.21450195312502],[-6.775781249999937,41.10771484375002],[-6.8828125,41.06240234375002],[-6.915527343749999,41.038037109374955],[-6.928466796874972,41.009130859375],[-6.857714843749932,40.87832031250002],[-6.835888671874926,40.777490234374994],[-6.818359375,40.65405273437497],[-6.829833984374943,40.619091796874955],[-6.835693359374971,40.48315429687497],[-6.852050781249943,40.44326171875002],[-6.847949218749988,40.410986328125006],[-6.82177734375,40.37626953124996],[-6.8101562499999,40.343115234375034],[-6.85888671875,40.30073242187504],[-6.948437499999955,40.251611328124966],[-7.01469726562496,40.208349609375034],[-7.032617187499965,40.16791992187498],[-7.027832031249972,40.14262695312496],[-6.91640625,40.05683593749998],[-6.896093749999949,40.02182617187506],[-6.911181640624989,39.937109375000034],[-6.975390624999932,39.79838867187502],[-7.03671875,39.713964843750034],[-7.04741210937496,39.70556640625],[-7.117675781249972,39.681689453125045],[-7.454101562499943,39.6806640625],[-7.535693359374961,39.66157226562501],[-7.524218749999932,39.644726562499955],[-7.44511718749996,39.53618164062496],[-7.362695312499966,39.47832031249999],[-7.335449218749999,39.46513671874996],[-7.30576171874992,39.33813476562502],[-7.172412109374932,39.13520507812498],[-7.042968749999942,39.10708007812502],[-6.997949218749993,39.05644531250002],[-7.00625,38.98525390624999],[-7.046044921874937,38.907031250000045],[-7.125488281249971,38.82695312499999],[-7.219921874999925,38.77050781250002],[-7.28154296874996,38.71455078125001],[-7.286376953124972,38.649365234374955],[-7.30595703124996,38.56684570312501],[-7.335791015625006,38.50146484375003],[-7.343017578124943,38.45742187500002],[-7.106396484374982,38.181005859375006],[-6.974804687499982,38.194433593750006],[-6.957568359374932,38.18789062499999],[-6.981103515624937,38.121972656249966],[-7.022851562500023,38.04472656249996],[-7.072509765625,38.030029296875],[-7.185449218749994,38.00634765625006],[-7.292236328125,37.90644531250004],[-7.378906249999971,37.786376953125],[-7.443945312499921,37.72827148437497],[-7.503515624999977,37.58549804687502],[-7.496044921874954,37.523583984375016],[-7.467187499999937,37.42802734374999],[-7.406152343749937,37.17944335937497],[-7.493603515624983,37.168310546875034],[-7.834130859374994,37.00571289062503],[-7.939697265625,37.00541992187496],[-8.136767578124932,37.077050781249994],[-8.484326171874955,37.10004882812498],[-8.597656249999943,37.12133789062506],[-8.739111328124977,37.07460937500002],[-8.8484375,37.07568359374997],[-8.935351562499987,37.01601562499999],[-8.997802734375028,37.03227539062502],[-8.92626953125,37.16606445312502],[-8.814160156249983,37.43081054687502],[-8.818554687500011,37.59243164062502],[-8.791845703124977,37.73281250000002],[-8.822656249999936,37.871875],[-8.87895507812496,37.95869140625001],[-8.80224609374997,38.18383789062497],[-8.810937499999966,38.299755859374955],[-8.881103515624943,38.44667968750005],[-8.668310546874947,38.42431640625003],[-8.73398437499992,38.48242187500006],[-8.798876953124989,38.518164062500034],[-8.861621093749987,38.50996093749998],[-8.914794921874972,38.512109374999966],[-9.09599609374996,38.45522460937502],[-9.186718749999953,38.438183593750004],[-9.213281249999937,38.44809570312498],[-9.203369140624972,38.53896484375002],[-9.250390624999964,38.65673828125002],[-9.17783203124992,38.68779296874996],[-9.09331054687493,38.69667968749999],[-9.021484374999943,38.746875],[-8.977050781249972,38.80292968749998],[-9.000488281249943,38.90302734375004],[-8.93808593749992,38.998095703125045],[-8.79160156249992,39.07817382812502],[-8.867480468749932,39.06596679687502],[-8.954296874999955,39.016064453124955],[-9.091015625000011,38.834667968749955],[-9.13579101562496,38.74277343749997],[-9.252294921875004,38.712792968749994],[-9.35673828124996,38.697900390624994],[-9.410205078124932,38.70751953125],[-9.474121093749972,38.73085937500002],[-9.479736328124972,38.79877929687501],[-9.474755859374937,38.852929687500016],[-9.431445312499987,38.96044921875],[-9.41435546874996,39.11210937499999],[-9.35283203124996,39.248144531250006],[-9.35722656249996,39.28427734374997],[-9.374755859374972,39.338281249999966],[-9.319628906249932,39.39111328125],[-9.251416015624983,39.426025390625],[-9.148291015624949,39.542578125000034],[-9.004052734374966,39.820556640625],[-8.837841796874926,40.11567382812498],[-8.851318359375028,40.151806640624976],[-8.886621093750023,40.179443359375],[-8.8726562499999,40.25908203124999],[-8.772412109374926,40.60566406249998],[-8.731591796874966,40.65092773437495],[-8.684619140624989,40.75253906250006],[-8.673974609374936,40.91650390624997],[-8.655566406249932,41.02949218749998],[-8.659814453124994,41.086279296875006],[-8.674609374999989,41.154492187499955],[-8.73837890624992,41.28466796875003],[-8.805664062499943,41.56000976562498],[-8.810839843749932,41.65195312500006],[-8.75541992187493,41.69838867187502],[-8.846386718749983,41.70517578124998],[-8.887597656249937,41.764599609375004],[-8.878222656249989,41.83208007812499],[-8.777148437500017,41.941064453124994],[-8.68295898437492,42.008496093749955],[-8.589648437499989,42.05273437499999],[-8.538085937499972,42.0693359375],[-8.322558593749932,42.115087890625006],[-8.266064453124983,42.13740234375001],[-8.213085937499926,42.133691406249966],[-8.204199218749977,42.11186523437496],[-8.17358398437497,42.06938476562501],[-8.139306640624994,42.039941406249966],[-8.129980468749977,42.01816406250006],[-8.213330078124983,41.92709960937498],[-8.224755859374994,41.895849609375006],[-8.18125,41.83696289062502],[-8.173535156249955,41.819970703124994]]]]}}]}

// Map
import Map from '../../../components/map';

const cartoProvider = new CartoProvider();

export default {
  title: 'Playground/Mask-Layer',
  argTypes: {
    deck: {
      table: {
        disable: true
      }
    },
  },
};

const Template: Story<LayerProps> = (args: any) => {
  const { id, tileUrl, decodeFunction, decodeParams } = args;

  const minZoom = 2;
  const maxZoom = 20;
  const [viewport, setViewport] = useState({});

  const [bounds] = useState(null);

  const handleViewportChange = useCallback((vw) => {
    setViewport(vw);
  }, []);

  return (
    <div
      key={JSON.stringify({
        id, tileUrl, decodeFunction, decodeParams
      })}
      style={{
        position: 'relative',
        width: '100%',
        height: '500px',
      }}
    >
      <Map
        bounds={bounds}
        minZoom={minZoom}
        maxZoom={maxZoom}
        viewport={viewport}
        mapboxApiAccessToken={process.env.STORYBOOK_MAPBOX_API_TOKEN}
        onMapViewportChange={handleViewportChange}
      >
        {(map) => (
          <LayerManager
            map={map}
            plugin={PluginMapboxGl}
            providers={{
              [cartoProvider.name]: cartoProvider.handleData,
            }}
          >
            <Layer
              {...args}
              deck={[
                {
                  id: 'mask',
                  type: GeoJsonLayer,
                  data: PORTUGAL_GEOJSON,
                  operation: 'mask',
                },
                {
                  id: 'deck-gain-layer',
                  type: TileLayer,
                  data: 'https://earthengine.google.org/static/hansen_2013/gain_alpha/{z}/{x}/{y}.png',
                  tileSize: 256,
                  visible: true,

                  renderSubLayers: (sl) => {
                    const {
                      id: subLayerId,
                      data,
                      tile,
                      visible,
                      opacity = 1,
                    } = sl;

                    const {
                      z,
                      bbox: {
                        west, south, east, north,
                      },
                    } = tile;

                    if (data) {
                      return new BitmapLayer({
                        id: subLayerId,
                        image: data,
                        bounds: [west, south, east, north],
                        extensions: [new MaskExtension()],
                        maskId: 'mask',
                        textureParameters: {
                          [GL.TEXTURE_MIN_FILTER]: GL.NEAREST,
                          [GL.TEXTURE_MAG_FILTER]: GL.NEAREST,
                          [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
                          [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE,
                        },
                        zoom: z,
                        visible,
                        opacity,
                      });
                    }
                    return null;
                  },
                  minZoom: 3,
                  maxZoom: 12,
                },
                {
                  id: 'selected-cities',
                  data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/cities15000.csv',
                  type: ScatterplotLayer,
                  getPosition: d => [d.longitude, d.latitude],
                  getRadius: d => Math.sqrt(d.population),
                  getFillColor: [255, 0, 128],
                  radiusMinPixels: 1,
                  pickable: true,
                  loaders: [CSVLoader],
                  maskId: 'mask',
                  extensions: [new MaskExtension()]
                },
              ]}
            />
          </LayerManager>
        )}
      </Map>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  id: 'deck-loss-mask',
  type: 'deck'
};