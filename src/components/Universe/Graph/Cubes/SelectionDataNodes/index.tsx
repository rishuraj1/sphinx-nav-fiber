import { Segments } from '@react-three/drei'
import { forceCollide, forceLink, forceSimulation } from 'd3-force-3d'
import { memo, useEffect, useRef, useState } from 'react'
import { Group } from 'three'
import { useShallow } from 'zustand/react/shallow'
import { usePrevious } from '~/hooks/usePrevious'
import { useDataStore } from '~/stores/useDataStore'
import { useGraphStore, useSelectedNode, useSelectedNodeRelativeIds } from '~/stores/useGraphStore'
import { ForceSimulation } from '~/transformers/forceSimulation'
import { GraphData, Link, NodeExtended } from '~/types'
import { Segment } from '../../Segment'
import { PathwayBadges } from '../../Segment/LinkBadge'
import { TextNode } from '../Text'

export const SelectionDataNodes = memo(() => {
  const [simulation2d, setSimulation2D] = useState<ForceSimulation | null>(null)

  const { dataInitial } = useDataStore((s) => s)
  const selectedNode = useSelectedNode()
  const groupRef = useRef<Group>(null)

  const selectedNodeRelativeIds = useSelectedNodeRelativeIds()

  const prevNodesLength = usePrevious(dataInitial?.nodes.length)

  const { selectionGraphData, setSelectionData } = useGraphStore(useShallow((s) => s))

  useEffect(() => {
    const structuredNodes = structuredClone(dataInitial?.nodes || [])
    const structuredLinks = structuredClone(dataInitial?.links || [])

    if (prevNodesLength === structuredNodes.length) {
      return
    }

    const nodes = structuredNodes
      .filter(
        (f: NodeExtended) => f.ref_id === selectedNode?.ref_id || selectedNodeRelativeIds.includes(f?.ref_id || ''),
      )
      .map((n: NodeExtended) => {
        const fixedPosition = n.ref_id === selectedNode?.ref_id ? { fx: 0, fy: 0, fz: 0 } : {}

        return { ...n, x: 0, y: 0, z: 0, ...fixedPosition }
      })

    if (nodes) {
      const links = structuredLinks.filter(
        (link: Link) =>
          nodes.some((node: NodeExtended) => node.ref_id === link.target) &&
          nodes.some((node: NodeExtended) => node.ref_id === link.source),
      )

      setSelectionData({ nodes, links: links as unknown as GraphData['links'] })
    }
  }, [dataInitial, selectedNode, selectedNodeRelativeIds, setSelectionData, prevNodesLength])

  useEffect(() => {
    if (simulation2d || !selectionGraphData.nodes.length) {
      return
    }

    const structuredLinks = structuredClone(selectionGraphData.links)

    const simulation = forceSimulation([])
      .numDimensions(2)
      .stop()
      .nodes(selectionGraphData.nodes)
      .force(
        'link',
        forceLink()
          .links(structuredLinks)
          .id((d: NodeExtended) => d.ref_id),
      )
      .force(
        'collide',
        forceCollide()
          .radius(() => 150)
          .strength(1)
          .iterations(1),
      )
      .alpha(1)
      .restart()

    setSimulation2D(simulation)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectionGraphData, simulation2d])

  useEffect(
    () => () => {
      setSelectionData({ nodes: [], links: [] })
    },
    [setSelectionData],
  )

  useEffect(() => {
    if (!simulation2d) {
      return
    }

    simulation2d.on('tick', () => {
      if (groupRef.current) {
        const gr = groupRef.current as Group

        gr.children.forEach((mesh, index) => {
          const simulationNode = simulation2d.nodes()[index]

          if (simulationNode) {
            mesh.position.set(simulationNode.x, simulationNode.y, simulationNode.z)
          }
        })
      }
    })
  }, [simulation2d])

  return (
    <>
      <group ref={groupRef} name="simulation-2d-group">
        {selectionGraphData?.nodes.map((node) => (
          <mesh key={node.ref_id}>
            <TextNode key={node.ref_id || node.id} hide ignoreDistance node={node} />
          </mesh>
        ))}
      </group>
      <Segments
        key={`selection-links-${selectionGraphData?.links.length}`}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        fog
        lineWidth={0.9}
      >
        {(selectionGraphData?.links as unknown as GraphData['links']).map((link, index) => (
          <Segment
            // eslint-disable-next-line react/no-array-index-key
            key={index.toString()}
            animated
            link={link}
          />
        ))}
      </Segments>
      {simulation2d && <PathwayBadges links={selectionGraphData.links} simulation={simulation2d} />}
    </>
  )
})

SelectionDataNodes.displayName = 'SelectionDataNodes'
