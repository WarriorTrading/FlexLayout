import { Subject } from "rxjs";

const subject = (): Subject<{ nodeId: string; title: string }> | undefined => {
  return (window as any).FlexLayoutTitleSubject;
};

export const init = () => {
  let sub = subject();
  if (sub === undefined) {
    sub = new Subject<{ nodeId: string; title: string }>();
    (window as any).FlexLayoutTitleSubject = sub;
  }
  return sub as Subject<{ nodeId: string; title: string }>;
};

export const release = () => {
  const sub = subject();
  if (sub !== undefined) {
    (sub as Subject<{ nodeId: string; title: string }>).complete();
    delete (window as any).FlexLayoutTitleSubject;
  }
};

export const subscribe = (
  next: (value: { nodeId: string; title: string }) => void
) => {
  const subscription = init().subscribe(next);
  return () => {
    subscription.unsubscribe();
  };
};

export const update = (payload: { nodeId: string; title: string }) => {
  const s = subject();
  if (s !== undefined) {
    s.next(payload);
  }
};

export default { init, release, subscribe, update };
