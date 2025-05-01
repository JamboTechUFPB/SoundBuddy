import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxLength: 500
  },
  media: {
    type: {
      type: String,
      enum: ['image', 'video', 'audio', null],
      default: null
    },
    url: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    }
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: {
    type: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      content: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    default: []
  },
  tags: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware para atualizar o updatedAt antes de salvar
postSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual populate para informações do usuário
postSchema.virtual("userInfo", {
  ref: "User",
  localField: "user",
  foreignField: "_id",
  justOne: true
});

// Método para extrair hashtags do conteúdo
postSchema.methods.extractTags = function() {
  const tags = this.content.match(/#[^\s#]+/g);
  this.tags = tags ? tags.map(tag => tag.slice(1).toLowerCase()) : [];
};

// generates an uuid for the post before even creating it
postSchema.pre("validate", function(next) {
  if (!this.id) {
    // create new object id (class constructor objectid cannot be invoked without new)
    this.id = new mongoose.Types.ObjectId().toString();
  }
  next();
});

// Call extractTags before saving the post
postSchema.pre('save', function(next) {
  this.extractTags();
  next();
});
// Método para adicionar um comentário
postSchema.methods.addComment = function(userId, content) {
  this.comments.push({
    user: userId,
    content: content,
    createdAt: Date.now()
  });
};

// Método para remover um comentário
postSchema.methods.removeComment = function(commentId) {
  this.comments = this.comments.filter(comment => comment._id.toString() !== commentId);
};

// Método para adicionar uma curtida
postSchema.methods.addLike = function() {
  this.likes += 1;
};
// Método para remover uma curtida
postSchema.methods.removeLike = function() {
  if (this.likes > 0) {
    this.likes -= 1;
  }
};

postSchema.set('toObject', { virtuals: true });

// show user info when getting the posts
// only get user name and about
postSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

const PostModel = mongoose.model("Post", postSchema);

export default PostModel;