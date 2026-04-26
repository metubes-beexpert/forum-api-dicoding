import DeleteCommentUseCase from "../DeleteCommentUseCase.js";
import CommentRepository from "../../../Domains/comments/CommentRepository.js";
import ThreadRepository from "../../../Domains/threads/ThreadRepository.js";

describe("DeleteCommentUseCase", () => {
  it("seharusnya mengorkestrasikan aksi hapus komentar dengan benar", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      owner: "user-123",
    };

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadAvailability = vi.fn().mockResolvedValue();
    mockCommentRepository.checkAvailabilityComment = vi
      .fn()
      .mockResolvedValue();
    mockCommentRepository.verifyCommentOwner = vi.fn().mockResolvedValue();
    mockCommentRepository.deleteComment = vi.fn().mockResolvedValue();

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Act
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(
      useCasePayload.commentId
    );
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner
    );
    expect(mockCommentRepository.deleteComment).toBeCalledWith(
      useCasePayload.commentId
    );
  });
});
