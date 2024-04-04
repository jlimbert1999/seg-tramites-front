interface Person {
  name: string;
  middlename: string;
  lastname: string;
  dni: string;
}
interface Crendentials {
  login: string;
  password: string;
}
export function generateCredentials(person: Person): Crendentials {
  const { name, middlename, lastname, dni } = person;
  const login = name.charAt(0) + middlename + lastname.charAt(0);
  return { login: login.trim().toUpperCase(), password: dni.trim() };
}
