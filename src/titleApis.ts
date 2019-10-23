import { Subject } from "rxjs";

interface ITitles {
  titles: { [nodeId: string]: string };
  subject: Subject<{ nodeId: string; title: string }> | undefined;
}

const shared: ITitles = {
  titles: {},
  subject: undefined
};

export const init = () => {
  if (shared.subject === undefined) {
    shared.subject = new Subject<{ nodeId: string; title: string }>();
  }
};

export const release = () => {
  if (shared.subject !== undefined) {
    shared.subject.complete();
    delete shared.subject;
  }
};

export const subscribe = (
  next: (value: { nodeId: string; title: string }) => void
) => {
  init();

  const subscription = shared.subject!.subscribe(next);
  return () => {
    subscription.unsubscribe();
  };
};

export const update = (payload: { nodeId: string; title: string }) => {
  shared.titles[payload.nodeId] = payload.title;
  if (shared.subject !== undefined) {
    shared.subject.next(payload);
  }
};

export const title = (nodeId: string) => {
  return shared.titles[nodeId] || "";
};

export default { init, release, subscribe, update, title };
