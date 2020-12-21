class Post {
    static posts = [];

    static find() {
        return Promise.resolve(this.posts);
    }

    static create(post) {
        if (
            typeof post !== 'object' ||
            typeof post.title !== 'string' ||
            typeof post.text !== 'string' ||
            typeof post.image !== 'string'
        ) {
            return Promise.reject('invalid post');
        }

        const newPost = this.posts.push({
            title: post.title,
            text: post.text,
            image: post.image,
            id: (this.posts.length + 1).toString(),
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return Promise.resolve(newPost);
    }

    static findById(id) {
        const post = this.posts.find((p) => p.id === id);

        return Promise.resolve(post);
    }

    static findByIdAndDelete(id) {
        const post = this.posts.find((p) => p.id === id);

        if (post) {
            this.posts = this.posts.filter((p) => p !== post);
        }

        return Promise.resolve(post);
    }

    static findByIdAndUpdate(id, post) {
        if (
            typeof post !== 'object' ||
            typeof post.title !== 'string' ||
            typeof post.text !== 'string' ||
            typeof post.image !== 'string'
        ) {
            return Promise.reject('invalid post');
        }

        const targetPost = this.posts.find((p) => p.id === id);

        if (targetPost) {
            Object.assign(targetPost, post);
        }

        return Promise.resolve(targetPost);
    }
}

module.exports = Post;