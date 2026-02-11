declare module 'bcryptjs' {
  function hash(s: string, rounds: number): Promise<string> | string;
  function compare(s: string, hash: string): Promise<boolean> | boolean;
  const bcrypt: {
    hash: typeof hash;
    compare: typeof compare;
  };
  export default bcrypt;
}
