import { mockMethods } from "aspida-mock";

export type Methods = {
  get: {
    status: 200;
    resBody: {
      id: string;
      title: string;
      completed: boolean;
    }[];
  };

  post: {
    status: 201;
    reqFormat: URLSearchParams;
    reqBody: {
      title: string;
    };
    resBody: {
      id: string;
      title: string;
      completed: boolean;
    };
  };

  put: {
    status: 204;
    reqFormat: URLSearchParams;
    reqBody: {
      title?: string;
      completed?: boolean;
    };
  };

  delete: {
    status: 204;
    reqFormat: URLSearchParams;
  };
};

export default mockMethods<Methods>({
  get: () => ({
    status: 200,
    resBody: [
      {
        id: "1",
        title: "Todo 1",
        completed: false,
      },
      {
        id: "2",
        title: "Todo 2",
        completed: true,
      },
    ],
  }),
  post: ({ reqBody }) => ({
    status: 201,
    resBody: {
      id: "3",
      title: reqBody.title,
      completed: false,
    },
  }),
  put: ({ reqBody }) => ({
    status: 204,
    resBody: reqBody,
  }),
  delete: () => ({
    status: 204,
  }),
});
