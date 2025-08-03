// src/store/slices/blogSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import { getBlogs as fetchBlogsApi } from "@/store/api/index";
import { Blog, BlogComment } from "../types/api";

export const fetchBlogs = createAsyncThunk(
  "blog/fetchBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchBlogsApi();
      const data = response?.data;
      if (data && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch blogs");
    }
  }
);
export interface RelatedBlog {
  id: string
  title: string
  img: string
}

interface BlogState {
  blogs: Blog[]
  selectedBlog?: Blog
  loading: boolean
  error?: string
}

const initialState: BlogState = {
  blogs: [],
  selectedBlog: undefined,
  loading: false,
  error: undefined,
}

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    fetchBlogsStart(state) {
      state.loading = true
      state.error = undefined
    },
    fetchBlogsSuccess(state, action: PayloadAction<Blog[]>) {
      state.blogs = action.payload
      state.loading = false
    },
    fetchBlogsFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    selectBlog(state, action: PayloadAction<string>) {
      state.selectedBlog = state.blogs.find(blog => blog._id === action.payload)
    },
    likeBlog(state, action: PayloadAction<string>) {
      const blog = state.blogs.find(b => b._id === action.payload)
      if (blog) blog.likes += 1
      if (state.selectedBlog && state.selectedBlog._id === action.payload) {
        state.selectedBlog.likes += 1
      }
    },
    addComment(state, action: PayloadAction<{ blogId: string; comment: BlogComment }>) {
      const blog = state.blogs.find(b => b._id === action.payload.blogId)
      if (blog) blog.comments.push(action.payload.comment)
      if (state.selectedBlog && state.selectedBlog._id === action.payload.blogId) {
        state.selectedBlog.comments.push(action.payload.comment)
      }
    },
    addReply(state, action: PayloadAction<{ blogId: string; commentId: string; reply: BlogComment }>) {
      const blog = state.blogs.find(b => b._id === action.payload.blogId)
      const findAndReply = (comments: BlogComment[]) => {
        return false
      }
      if (blog) findAndReply(blog.comments)
      if (state.selectedBlog && state.selectedBlog._id === action.payload.blogId) {
        findAndReply(state.selectedBlog.comments)
      }
    },
    updateFeaturedImage(state, action: PayloadAction<{ blogId: string; featuredImage: string }>) {
      const blog = state.blogs.find(b => b._id === action.payload.blogId)
      if (blog) blog.featuredImage = action.payload.featuredImage
      if (state.selectedBlog && state.selectedBlog._id === action.payload.blogId) {
        state.selectedBlog.featuredImage = action.payload.featuredImage
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.blogs = action.payload;
        state.loading = false;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
})

export const {
  fetchBlogsStart,
  fetchBlogsSuccess,
  fetchBlogsFailure,
  selectBlog,
  likeBlog,
  addComment,
  addReply,
  updateFeaturedImage,
} = blogSlice.actions

export default blogSlice.reducer
