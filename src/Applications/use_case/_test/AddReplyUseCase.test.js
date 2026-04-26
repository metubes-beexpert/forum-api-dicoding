import AddReplyUseCase from "../AddReplyUseCase.js";
import ReplyRepository from "../../../Domains/replies/ReplyRepository.js";
import CommentRepository from "../../../Domains/comments/CommentRepository.js";
import ThreadRepository from "../../../Domains/threads/ThreadRepository.js";
import NewReply from "../../../Domains/replies/entities/NewReply.js";
import AddedReply from "../../../Domains/replies/entities/AddedReply.js";

describe("AddReplyUseCase", () => {
  it("seharusnya mengorkestrasikan aksi tambah balasan dengan benar", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      content: "sebuah balasan",
      owner: "user-123",
    };

    const expectedAddedReply = new AddedReply({
      id: "reply-123",
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // Mocking
    mockThreadRepository.verifyThreadAvailability = vi.fn().mockResolvedValue();
    mockCommentRepository.checkAvailabilityComment = vi
      .fn()
      .mockResolvedValue();
    mockReplyRepository.addReply = vi
      .fn()
      .mockResolvedValue(expectedAddedReply);

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Act
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(
      useCasePayload.commentId
    );
    expect(mockReplyRepository.addReply).toBeCalledWith(
      new NewReply({ content: useCasePayload.content }),
      useCasePayload.commentId,
      useCasePayload.owner
    );
  });
});
