import _ from 'lodash';
import { createSelector } from 'reselect';

const featuresSelector = state => state.home.features;
const featureByIdSelector = state => state.home.featureById;

export const getProjectDiagramData = createSelector(
  featuresSelector,
  featureByIdSelector,
  (features, featureById) => {
    const links = [];
    const nodes = features.map((fid) => {
      const f = featureById[fid];
      const feature = { name: f.name, id: f.key, r: 30 };

      [...f.components, ...f.actions, ...f.misc].forEach((item) => {
        if (!item.deps) return;
        [
          ...item.deps.actions,
          ...item.deps.components,
          ...item.deps.constants,
          ...item.deps.misc,
        ].forEach((dep) => {
          if (dep.feature === fid) return;

          const data = {
            source: fid,
            target: dep.feature,
            type: dep.type,
          };
          const found = _.find(links, data);
          if (found) {
            found.count += 1;
          } else {
            links.push({
              ...data,
              count: 1,
            });
          }
        });
      });
      return feature;
    });

    // Relation types: component, action, store, constant, misc
    for (let i = 0; i < nodes.length; i++) { // eslint-disable-line
      for (let j = 0; j < nodes.length; j++) { // eslint-disable-line
        if (i === j) continue; // eslint-disable-line
        const f1 = nodes[i];
        const f2 = nodes[j];

        const arr = links
          .filter(l => (l.source === f1.id && l.target === f2.id) || (l.source === f2.id && l.target === f1.id))
          .sort((l1, l2) => (l1.source !== l2.source ? l1.source.localeCompare(l2.source) : l1.type.localeCompare(l2.type)))
        ;

        if (arr.length > 0) {
          const firstSource = arr[0].source;
          arr.forEach((link, k) => {
            const m = Math.floor(arr.length / 2);
            if (arr.length % 2 === 0) {
              if (k < m) link.pos = k - m;
              else link.pos = k - m + 1;
            } else {
              link.pos = k - m;
            }
            if (link.source !== firstSource) {
              link.pos = -link.pos;
            }
          });
        }
      }
    }
    return { nodes, links };
  },
);