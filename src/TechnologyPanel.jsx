import React from 'react';
import {technologyGroups} from './technologyCatalog';

export function TechnologyPanel({technologies}) {
  return <section className="implementation verified-technology" aria-label="实际技术">
    <h3>实际技术</h3>
    {technologyGroups.map(([group,label]) => {
      const items = technologies.filter(item => item.group === group);
      return items.length ? <div className="technology-group" key={group}>
        <h4>{label}</h4>
        <div className="technology-badges">{items.map(item => <span key={item.id} data-technology={item.id} title={item.detail}>{item.name}</span>)}</div>
      </div> : null;
    })}
  </section>;
}
