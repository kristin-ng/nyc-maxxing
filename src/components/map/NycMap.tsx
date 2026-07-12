import { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import type { ProjectionFunction } from 'react-simple-maps';
import { geoMercator } from 'd3-geo';
import type { GeoProjection } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
// (types resolve via the @types/topojson-specification transitive dependency of @types/topojson-client)
import type { FeatureCollection } from 'geojson';
import ntaTopology from '../../data/nyc-nta-topo.json';
import { neighborhoods, NTA_ID_PROPERTY } from '../../data/neighborhoods';
import { useNeighborhoodStore } from '../../store/useNeighborhoodStore';
import { STATUS_COLORS, UNSET_COLOR, NON_RESIDENTIAL_COLOR, HOVER_STROKE } from '../../utils/colors';
import { isNonResidentialNta } from '../../utils/nta';
import { MapTooltip } from './MapTooltip';
import './NycMap.css';

const WIDTH = 800;
const HEIGHT = 800;

const topology = ntaTopology as unknown as Topology;
const objectKey = Object.keys(topology.objects)[0];
const geoJson = feature(
  topology,
  topology.objects[objectKey] as GeometryCollection
) as unknown as FeatureCollection;

// react-simple-maps uses a function `projection` prop directly as a projection
// instance (it does not call it as a factory), so `fitSize` must be applied here.
const projection: GeoProjection = geoMercator().fitSize([WIDTH, HEIGHT], geoJson);

interface NycMapProps {
  onSelectNeighborhood: (id: string) => void;
}

export function NycMap({ onSelectNeighborhood }: NycMapProps) {
  const statuses = useNeighborhoodStore((s) => s.statuses);
  const [hovered, setHovered] = useState<{ name: string; x: number; y: number } | null>(null);

  // @types/react-simple-maps mis-types `projection` as a (w, h, config) => GeoProjection
  // factory; at runtime a function prop is used directly as the projection instance.
  return (
    <div className="nyc-map">
      <ComposableMap
        width={WIDTH}
        height={HEIGHT}
        projection={projection as unknown as ProjectionFunction}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup zoom={1} minZoom={1} maxZoom={12}>
          <Geographies geography={ntaTopology}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const id = geo.properties?.[NTA_ID_PROPERTY];
                const neighborhood = id ? neighborhoods[id] : undefined;
                const status = id ? statuses[id] : undefined;
                const isNonResidential = id ? isNonResidentialNta(id) : false;
                const fill = isNonResidential
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
                      default: { outline: 'none', cursor: isNonResidential ? 'default' : 'pointer' },
                      hover: isNonResidential
                        ? { outline: 'none', cursor: 'default' }
                        : { outline: 'none', stroke: HOVER_STROKE, strokeWidth: 1.2, cursor: 'pointer' },
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
                      if (neighborhood && !isNonResidential) {
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
