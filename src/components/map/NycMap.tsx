import { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import type { ProjectionFunction } from 'react-simple-maps';
import { geoMercator } from 'd3-geo';
import type { GeoProjection } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
// (types resolve via the @types/topojson-specification transitive dependency of @types/topojson-client)
import type { FeatureCollection } from 'geojson';
import neighborhoodTopology from '../../data/nyc-neighborhoods-topo.json';
import { neighborhoods, NEIGHBORHOOD_ID_PROPERTY } from '../../data/neighborhoods';
import { useNeighborhoodStore } from '../../store/useNeighborhoodStore';
import { STATUS_COLORS, UNSET_COLOR, NON_RESIDENTIAL_COLOR, HOVER_STROKE } from '../../utils/colors';
import { isNonResidentialArea } from '../../utils/nonResidentialAreas';
import { MapTooltip } from './MapTooltip';
import './NycMap.css';

const WIDTH = 800;
const HEIGHT = 800;
const MIN_ZOOM = 1;
const MAX_ZOOM = 12;
const ZOOM_STEP = 1.5;

const topology = neighborhoodTopology as unknown as Topology;
const objectKey = Object.keys(topology.objects)[0];
const geoJson = feature(
  topology,
  topology.objects[objectKey] as GeometryCollection
) as unknown as FeatureCollection;

// react-simple-maps uses a function `projection` prop directly as a projection
// instance (it does not call it as a factory), so `fitSize` must be applied here.
const projection: GeoProjection = geoMercator().fitSize([WIDTH, HEIGHT], geoJson);

// ZoomableGroup recenters on its `center` prop (in geo coordinates) whenever `zoom`
// changes. Without an explicit center it defaults to [0, 0] (null island), which this
// projection maps far outside the canvas — so zoom-button clicks were panning the map
// out of view entirely. Anchoring on the point that projects to the canvas center keeps
// zoom-in/out centered on NYC instead.
const CENTER = projection.invert!([WIDTH / 2, HEIGHT / 2]) as [number, number];

interface NycMapProps {
  onSelectNeighborhood: (id: string) => void;
}

export function NycMap({ onSelectNeighborhood }: NycMapProps) {
  const statuses = useNeighborhoodStore((s) => s.statuses);
  const [hovered, setHovered] = useState<{ name: string; x: number; y: number } | null>(null);
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom((z) => Math.min(z * ZOOM_STEP, MAX_ZOOM));
  const handleZoomOut = () => setZoom((z) => Math.max(z / ZOOM_STEP, MIN_ZOOM));

  // @types/react-simple-maps mis-types `projection` as a (w, h, config) => GeoProjection
  // factory; at runtime a function prop is used directly as the projection instance.
  return (
    <div className="nyc-map">
      <div className="nyc-map-zoom-controls">
        <button
          type="button"
          aria-label="Zoom in"
          onClick={handleZoomIn}
          disabled={zoom >= MAX_ZOOM}
        >
          +
        </button>
        <button
          type="button"
          aria-label="Zoom out"
          onClick={handleZoomOut}
          disabled={zoom <= MIN_ZOOM}
        >
          −
        </button>
      </div>
      <ComposableMap
        width={WIDTH}
        height={HEIGHT}
        projection={projection as unknown as ProjectionFunction}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup
          center={CENTER}
          zoom={zoom}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          onMoveEnd={({ zoom: nextZoom }) => setZoom(nextZoom)}
        >
          <Geographies geography={neighborhoodTopology}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const id = geo.properties?.[NEIGHBORHOOD_ID_PROPERTY];
                const neighborhood = id ? neighborhoods[id] : undefined;
                const status = id ? statuses[id] : undefined;
                const fill = id && isNonResidentialArea(id)
                  ? NON_RESIDENTIAL_COLOR
                  : status
                    ? STATUS_COLORS[status]
                    : UNSET_COLOR;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke="#0d0d10"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', stroke: HOVER_STROKE, strokeWidth: 1.2 },
                      pressed: { outline: 'none' },
                    }}
                    onMouseEnter={(event) => {
                      if (neighborhood) {
                        setHovered({
                          name: neighborhood.name,
                          x: event.clientX,
                          y: event.clientY,
                        });
                      }
                    }}
                    onMouseMove={(event) => {
                      setHovered((prev) =>
                        prev ? { ...prev, x: event.clientX, y: event.clientY } : prev
                      );
                    }}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => {
                      if (neighborhood && !isNonResidentialArea(neighborhood.id)) {
                        onSelectNeighborhood(neighborhood.id);
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {hovered && <MapTooltip name={hovered.name} x={hovered.x} y={hovered.y} />}
    </div>
  );
}
