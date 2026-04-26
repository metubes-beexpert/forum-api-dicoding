import DeleteReplyUseCase from "../DeleteReplyUseCase.js";
import ReplyRepository from "../../../Domains/replies/ReplyRepository.js";
import CommentRepository from "../../../Domains/comments/CommentRepository.js";
import ThreadRepository from "../../../Domains/threads/ThreadRepository.js";

describe("DeleteReplyUseCase", () => {
  it("seharusnya mengorkestrasikan aksi hapus balasan dengan benar", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      replyId: "reply-123",
      owner: "user-123",
    };

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadAvailability = vi.fn().mockResolvedValue();
    mockCommentRepository.checkAvailabilityComment = vi
      .fn()
      .mockResolvedValue();
    mockReplyRepository.checkAvailabilityReply = vi.fn().mockResolvedValue();
    mockReplyRepository.verifyReplyOwner = vi.fn().mockResolvedValue();
    mockReplyRepository.deleteReply = vi.fn().mockResolvedValue();

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Act
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(
      useCasePayload.commentId
    );
    expect(mockReplyRepository.checkAvailabilityReply).toBeCalledWith(
      useCasePayload.replyId
    );
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(
      useCasePayload.replyId,
      useCasePayload.owner
    );
    expect(mockReplyRepository.deleteReply).toBeCalledWith(
      useCasePayload.replyId
    );
  });
});
