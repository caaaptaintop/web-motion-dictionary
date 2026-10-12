import {useEffect,useState} from 'react';

export function useTechnologyEnvironment() {
  const read = () => ({
    narrow:matchMedia('(max-width:850px)').matches,
    coarsePointer:matchMedia('(pointer: coarse)').matches,
    noHover:matchMedia('(hover: none)').matches,
  });
  const [environment,setEnvironment] = useState(read);
  useEffect(() => {
    const queries = [matchMedia('(max-width:850px)'),matchMedia('(pointer: coarse)'),matchMedia('(hover: none)')];
    const update = () => setEnvironment(read());
    queries.forEach(q => q.addEventListener('change',update));
    return () => queries.forEach(q => q.removeEventListener('change',update));
  },[]);
  return environment;
}
