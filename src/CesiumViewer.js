import React, { useRef } from "react";
import {
  Viewer,
  Entity,
  PointGraphics,
  EntityDescription,
  Cesium3DTileset,
  ModelGraphics
} from "resium";
import {
  Cartesian3,
  createWorldTerrain,
  HeadingPitchRange,
  Cesium3DTileColorBlendMode,
  Cesium3DTileStyle
} from "cesium";
const terrainProvider = createWorldTerrain();
const position = Cartesian3.fromDegrees(-74.0707383, 40.7117244, 100);

const CesiumViewer = () => {
  const viewerRef = useRef(null);
  const defautHpr = new HeadingPitchRange(0, -Math.PI / 2, 500);
  let tilePosition = new Cartesian3.fromDegrees(0, 0);
  console.log("tilePosition", tilePosition);
  // <Viewer full terrainProvider={terrainProvider}>
  //   <Entity position={position} name="Tokyo">
  //     <PointGraphics pixelSize={10} />
  //     <EntityDescription>
  //       <h1>Hello, world.</h1>
  //       <p>JSX is available here!</p>
  //     </EntityDescription>
  //   </Entity>
  // </Viewer>
  return (
    <Viewer
      timeline={false}
      homeButton={false}
      navigationInstructionsInitiallyVisible={false}
      navigationHelpButton={false}
      selectionIndicator={false}
      infoBox={false}
      full
      ref={viewerRef}
    >
      <Cesium3DTileset
        colorBlendAmount={0.7}
        colorBlendMode={Cesium3DTileColorBlendMode.MIX}
        debugShowContentBoundingVolume={true}
        // url="https://obt-test-eu.s3-eu-west-1.amazonaws.com/a31ce0eb7eaa480b8602cb0edcdff7cb/tileset.json"
        url="./tiles/tile2/tile3.json"
        // url="./tiles/9e43f57b8dd94cbaa188059516b29642/tileset.json"
        // url = "https://obt-test-eu.s3-eu-west-1.amazonaws.com/2b911544a4b44d668974d24f945a1f8d/tileset.json"
        onReady={tile => {
          var style = new Cesium3DTileStyle({
            pointSize: 4,
            color: 'color("green")'
          });
          style.pointOutlineColor = 'color("blue")';
          style.pointOutlineWidth = "5";

          tile.style = style;
          if (viewerRef.current) {
            const viewer = viewerRef.current.cesiumElement;
            viewer.zoomTo(tile, defautHpr);
          }
        }}
      />
      {/* <Cesium3DTileset
        colorBlendAmount={0.7}
        colorBlendMode={Cesium3DTileColorBlendMode.MIX}
        // url="https://obt-test-eu.s3-eu-west-1.amazonaws.com/a31ce0eb7eaa480b8602cb0edcdff7cb/tileset.json"
        // url="./tiles/tile2/tile3.json"
        url="./tiles/9e43f57b8dd94cbaa188059516b29642/tileset.json"
        // url = "https://obt-test-eu.s3-eu-west-1.amazonaws.com/2b911544a4b44d668974d24f945a1f8d/tileset.json"
        onReady={tile => {
          tile.style = new Cesium3DTileStyle({
            pointSize: 4,
            color: 'color("green")'
          });
          if (viewerRef.current) {
            const viewer = viewerRef.current.cesiumElement;
            viewer.zoomTo(tile, defautHpr);
          }
        }}
      />
      <Cesium3DTileset
        colorBlendAmount={0.7}
        colorBlendMode={Cesium3DTileColorBlendMode.MIX}
        url="./tiles/70e20923355e40309822dc32349136f0/tileset.json"
        onReady={tile => {
          tile.style = new Cesium3DTileStyle({
            pointSize: 4,
            color: 'color("red")'
          });
        }}
      />
      <Cesium3DTileset
        colorBlendAmount={0.7}
        colorBlendMode={Cesium3DTileColorBlendMode.MIX}
        url="./tiles/7682524a51394cceb3d25f59eabb79a1/tileset.json"
        onReady={tile => {
          tile.style = new Cesium3DTileStyle({
            pointSize: 4,
            color: 'color("yellow")'
          });
        }}
      />
      <Cesium3DTileset
        colorBlendAmount={0.7}
        colorBlendMode={Cesium3DTileColorBlendMode.MIX}
        url="./tiles/af963671cd4d451487043ef6f6a0dd62/tileset.json"
        onReady={tile => {
          tile.style = new Cesium3DTileStyle({
            pointSize: 4,
            color: 'color("blue")'
          });
        }}
      />

      <Cesium3DTileset
        colorBlendAmount={0.7}
        colorBlendMode={Cesium3DTileColorBlendMode.MIX}
        url="./tiles/c1e99e2cdf664c3088f54a477e7528d9/tileset.json"
        onReady={tile => {
          tile.style = new Cesium3DTileStyle({
            pointSize: 4,
            color: 'color("pink")'
          });
        }}
      /> */}

      {/* <Entity
        name="ModelGraphics"
        description="ModelGraphics!!"
        position={Cartesian3.fromDegrees(-74.0707383, 40.7117244, 100)}
      >
        <ModelGraphics uri="./tiles/tile2/t2.glb" minimumPixelSize={128} maximumScale={20000} 
        />
      </Entity> */}
    </Viewer>
  );
};

export default CesiumViewer;
