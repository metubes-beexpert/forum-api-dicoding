import LikesTableTestHelper from "../../../../tests/LikesTableTestHelper.js";
import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper.js";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper.js";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import pool from "../../database/postgres/pool.js";
import LikeRepositoryPostgres from "../LikeRepositoryPostgres.js";

describe("LikeRepositoryPostgres", () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addLike function", () => {
    it("seharusnya memasukkan like ke database", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });

      const fakeIdGenerator = () => "123";
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await likeRepositoryPostgres.addLike("comment-123", "user-123");

      const likes = await LikesTableTestHelper.findLikeById("like-123");
      expect(likes).toHaveLength(1);
    });
  });

  describe("deleteLike function", () => {
    it("seharusnya menghapus like dari database", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });
      await LikesTableTestHelper.addLike({
        id: "like-123",
        commentId: "comment-123",
        owner: "user-123",
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      await likeRepositoryPostgres.deleteLike("comment-123", "user-123");

      const likes = await LikesTableTestHelper.findLikeById("like-123");
      expect(likes).toHaveLength(0);
    });
  });

  describe("checkLikeExistence function", () => {
    it("seharusnya mengembalikan true jika like ada", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });
      await LikesTableTestHelper.addLike({
        id: "like-123",
        commentId: "comment-123",
        owner: "user-123",
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      const isExist = await likeRepositoryPostgres.checkLikeExistence(
        "comment-123",
        "user-123"
      );
      expect(isExist).toEqual(true);
    });

    it("seharusnya mengembalikan false jika like tidak ada", async () => {
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      const isExist = await likeRepositoryPostgres.checkLikeExistence(
        "comment-123",
        "user-123"
      );
      expect(isExist).toEqual(false);
    });
  });

  describe("getLikesByThreadId function", () => {
    it("seharusnya mengembalikan array likes dengan benar", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });
      await LikesTableTestHelper.addLike({
        id: "like-123",
        commentId: "comment-123",
        owner: "user-123",
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      const likes = await likeRepositoryPostgres.getLikesByThreadId(
        "thread-123"
      );

      expect(likes).toBeInstanceOf(Array);
      expect(likes).toHaveLength(1);
      expect(likes[0].comment_id).toEqual("comment-123");
    });
  });
});
