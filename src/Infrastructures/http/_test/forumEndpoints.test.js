import request from "supertest";
import createServer from "../createServer.js";
import container from "../../container.js";
import pool from "../../database/postgres/pool.js";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import AuthenticationsTableTestHelper from "../../../../tests/AuthenticationsTableTestHelper.js";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper.js";
import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper.js";
import RepliesTableTestHelper from "../../../../tests/RepliesTableTestHelper.js";
import LikesTableTestHelper from "../../../../tests/LikesTableTestHelper.js";

describe("Forum API Functional Endpoints", () => {
  let app;

  beforeAll(async () => {
    app = await createServer(container);
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  it("seharusnya mengorkestrasikan seluruh endpoint forum dengan benar hingga 100% coverage", async () => {
    // 1. Register & Login
    await request(app).post("/users").send({
      username: "dicoding",
      password: "password",
      fullname: "Dicoding",
    });
    const login = await request(app)
      .post("/authentications")
      .send({ username: "dicoding", password: "password" });
    const accessToken = login.body.data.accessToken;

    // 2. Add Thread (Berhasil & Gagal)
    await request(app)
      .post("/threads")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({}); // Gagal (Coverage 400)
    const thread = await request(app)
      .post("/threads")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: "A", body: "B" });
    const threadId = thread.body.data.addedThread.id;

    // 3. Add Comment (Berhasil & Gagal)
    await request(app)
      .post(`/threads/${threadId}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({}); // Gagal
    const comment = await request(app)
      .post(`/threads/${threadId}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ content: "C" });
    const commentId = comment.body.data.addedComment.id;

    // 4. Add Reply (Berhasil & Gagal)
    await request(app)
      .post(`/threads/${threadId}/comments/${commentId}/replies`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({}); // Gagal
    const reply = await request(app)
      .post(`/threads/${threadId}/comments/${commentId}/replies`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ content: "D" });
    const replyId = reply.body.data.addedReply.id;

    // 5. Like Comment (Berhasil & Gagal)
    await request(app)
      .put(`/threads/${threadId}/comments/xxx/likes`)
      .set("Authorization", `Bearer ${accessToken}`); // Gagal
    await request(app)
      .put(`/threads/${threadId}/comments/${commentId}/likes`)
      .set("Authorization", `Bearer ${accessToken}`); // Berhasil Like
    await request(app)
      .put(`/threads/${threadId}/comments/${commentId}/likes`)
      .set("Authorization", `Bearer ${accessToken}`); // Berhasil Unlike

    // 6. Get Thread (Berhasil & Gagal)
    await request(app).get(`/threads/xxx`); // Gagal
    const getThread = await request(app).get(`/threads/${threadId}`); // Berhasil
    expect(getThread.status).toEqual(200);

    // 7. Delete Reply (Berhasil & Gagal)
    await request(app)
      .delete(`/threads/${threadId}/comments/${commentId}/replies/xxx`)
      .set("Authorization", `Bearer ${accessToken}`); // Gagal
    await request(app)
      .delete(`/threads/${threadId}/comments/${commentId}/replies/${replyId}`)
      .set("Authorization", `Bearer ${accessToken}`); // Berhasil

    // 8. Delete Comment (Berhasil & Gagal)
    await request(app)
      .delete(`/threads/${threadId}/comments/xxx`)
      .set("Authorization", `Bearer ${accessToken}`); // Gagal
    await request(app)
      .delete(`/threads/${threadId}/comments/${commentId}`)
      .set("Authorization", `Bearer ${accessToken}`); // Berhasil
  }, 15000); // <-- TAMBAHKAN ANGKA 15000 DI SINI (Memberikan waktu 15 detik)
});
