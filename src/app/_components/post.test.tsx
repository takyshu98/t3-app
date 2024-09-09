import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { LatestPost } from "./post";

const mockUseSuspenseQuery = vi.hoisted(() => vi.fn());
const mockMutate = vi.fn(
  async (
    newData: { name: string },
    callback: { onSuccess: () => Promise<void> },
  ) => {
    await callback.onSuccess();
  },
);
let mockIsPending = false;
const mockInvalidate = vi.fn();

vi.mock("~/trpc/react", () => ({
  api: {
    post: {
      getLatest: {
        useSuspenseQuery: mockUseSuspenseQuery,
      },
      create: {
        useMutation: vi.fn((callback: { onSuccess: () => Promise<void> }) => ({
          mutate: (newData: { name: string }) => mockMutate(newData, callback),
          isPending: mockIsPending,
        })),
      },
    },
    useUtils: vi.fn(() => ({
      post: {
        invalidate: mockInvalidate,
      },
    })),
  },
}));

describe("LatestPost", () => {
  beforeEach(() => {
    mockMutate.mockClear();
    mockUseSuspenseQuery.mockReturnValue([{ name: "Test Post" }]);
    mockIsPending = false;
  });

  it("renders with a latest post", () => {
    render(<LatestPost />);
    expect(
      screen.getByText("Your most recent post: Test Post"),
    ).toBeInTheDocument();
  });

  it("renders without a latest post", () => {
    mockUseSuspenseQuery.mockReturnValue([]);
    render(<LatestPost />);
    expect(screen.getByText("You have no posts yet.")).toBeInTheDocument();
  });

  it("renders with submitted", () => {
    render(<LatestPost />);
    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.getByText("Submit")).not.toBeDisabled();
  });

  it("renders with submitting", () => {
    mockIsPending = true;
    render(<LatestPost />);
    expect(screen.getByText("Submitting...")).toBeInTheDocument();
    expect(screen.getByText("Submitting...")).toBeDisabled();
  });

  it("submits new post", async () => {
    render(<LatestPost />);
    const input = screen.getByPlaceholderText("Title");
    const button = screen.getByText("Submit");

    await userEvent.type(input, "New Post");
    await userEvent.click(button);

    expect(mockMutate).toHaveBeenCalledTimes(1);
    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({ name: "New Post" }),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
    expect(mockInvalidate).toHaveBeenCalledTimes(1);
    expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
  });
});
