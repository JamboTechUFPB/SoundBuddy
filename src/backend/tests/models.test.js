import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import userModel from "../models/userModel.js"; // ajuste o caminho

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await userModel.deleteMany(); // limpa a coleção após cada teste
});

test("cria um usuário com sucesso e esconde campos sensíveis no JSON", async () => {
  const user = new userModel({
    name: "João",
    email: "joao@email.com",
    password: "senha123",
    userType: "musician",
  });

  const savedUser = await user.save();

  expect(savedUser.name).toBe("João");
  expect(savedUser.email).toBe("joao@email.com");
  expect(savedUser.password).toBe("senha123");

  const jsonUser = savedUser.toJSON();

  // Confirma que campos sensíveis foram removidos da saída
  expect(jsonUser.password).toBeUndefined();
  expect(jsonUser.refreshToken).toBeUndefined();
});

test("não permite e-mails duplicados", async () => {
  await userModel.create({
    name: "User 1",
    email: "email@teste.com",
    password: "123",
  });

  await expect(
    userModel.create({
      name: "User 2",
      email: "email@teste.com",
      password: "456",
    })
  ).rejects.toThrow();
});

test("usa o valor padrão de userType e tags", async () => {
  const user = await userModel.create({
    name: "Ana",
    email: "ana@teste.com",
    password: "123456",
  });

  expect(user.userType).toBe("musician");
  expect(user.tags).toEqual([]);
});
