export const DBConfig = {
  name: "chatgpt-unwrapped-2023",
  version: 1,
  objectStoresMeta: [
    {
      store: "chatgpt-unwrapped",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        {
          name: "userTitle",
          keypath: "userTitle",
          options: { unique: false },
        },
        {
          name: "categorised",
          keypath: "categorised",
          options: { unique: false },
        },
        {
          name: "conversations",
          keypath: "conversations",
          options: { unique: false },
        },
      ],
    },
  ],
};
