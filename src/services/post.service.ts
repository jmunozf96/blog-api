import { CloudinaryService } from './cloudinary.service';
import { PostRepository } from '../repositories/post.repository';
import { NotFoundError } from '../errors/not-found.error';
import { getPaginationParams, PaginatedResult } from '../models/pagination.model';
import { Post } from '../generated/prisma';
import { PostDTO, toDTO, toDTOs } from '../models/post.dto';

export class PostService {
    constructor(private postRepo: PostRepository) { }

    async createPost(data: any) {
        const { title, content, authorId, file } = data;
        const { url, publicId } = await CloudinaryService.uploadImage(file.path);
        const post = await this.postRepo.create({
            title,
            content,
            authorId,
            imageUrl: url,
            imagePublicId: publicId
        });
        return toDTO(post);
    }

    async getAllPosts(authorId: number) {
        var posts = await this.postRepo.findAllByUser(authorId);
        return toDTOs(posts);
    }

    async getUserPostsPaginated(authorId: number, query: any): Promise<PaginatedResult<PostDTO>> {
        const pagination = getPaginationParams(query);
        var paginated = await this.postRepo.findAllByUserPaginated(authorId, pagination);
        return { data: toDTOs(paginated.data), meta: paginated.meta };
    }

    async getPost(id: string, authorId: number) {
        const post = await this.postRepo.findByIdAndUser(id, authorId);
        if (!post) throw new NotFoundError('Post not found');
        return toDTO(post);
    }

    async updatePost(id: string, data: { authorId: number, title?: string; content?: string; file?: Express.Multer.File }) {
        const post = await this.postRepo.findByIdAndUser(id, data.authorId);
        if (!post) throw new NotFoundError('Post not found');

        let imageUrl = post.imageUrl;
        let imagePublicId = post.imagePublicId;

        if (data.file) {
            if (imagePublicId) {
                await CloudinaryService.deleteImage(imagePublicId);
            }

            const { url, publicId } = await CloudinaryService.uploadImage(data.file.path);
            imageUrl = url;
            imagePublicId = publicId;
        }

        const updatedPost = await this.postRepo.updateByUser(id, data.authorId, {
            title: data.title ?? post.title,
            content: data.content ?? post.content,
            imageUrl,
            imagePublicId,
        });

        return toDTO(updatedPost);
    }

    async deletePost(id: string, authorId: number) {
        const post = await this.postRepo.findByIdAndUser(id, authorId);
        if (!post) throw new NotFoundError('Post not found');

        if (post.imagePublicId) {
            await CloudinaryService.deleteImage(post.imagePublicId);
        }

        await this.postRepo.deleteByUser(id, authorId);
    }
}