import { getConnection } from "../src/connect";

describe("Postgres Connection Test", () => {
  it("connection is success", async () => {
    const connection = await getConnection();
    expect(connection.isConnected).toBe(true);
  });
});
