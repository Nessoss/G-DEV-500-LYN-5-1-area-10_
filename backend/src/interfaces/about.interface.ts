export interface AboutResponse {
  client: {
    host: string;
  };
  server: {
    current_time: number;
    services: Service[];
  };
}

export interface Service {
  name: string;
  actions: Action[];
  reactions: Reaction[];
}

export interface Action {
  name: string;
  description: string;
}

export interface Reaction {
  name: string;
  description: string;
}
