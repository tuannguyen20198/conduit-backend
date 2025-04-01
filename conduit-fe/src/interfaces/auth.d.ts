export interface User {
  [x: string]: never[];
  email: string;
  token: string;
  username: string;
  bio: string | null;
  image: string | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export interface AuthContextType {
  user: User | null;
  login: (userData: { user: User }) => void;
  register: (userData: { user: User }) => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}
