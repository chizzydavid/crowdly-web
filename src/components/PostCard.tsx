import React,{ useState } from 'react';
import { Box, Heading, Text, Flex, IconButton, Link } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { User, useVoteMutation, useDeletePostMutation } from '../generated/graphql';
import NextLink from "next/link";

export interface Post {
  id: number;
  title: string;
  text: string;
  creatorId?: number;
  createdAt: string;
  textSnippet: string;
  creator?: User;
  points?: number;
}

interface PostCardProps {
  belongsToUser?: boolean;
  post?: Post
}

const PostCard: React.FC<PostCardProps> = ({ post, belongsToUser }) => {
  const [loadingState, setLoadingState] = useState<'updoot-loading' | 'downdoot-loading' | 'not-loading'>('not-loading')
  const [, vote] = useVoteMutation();
  const [{ fetching }, deletePost] = useDeletePostMutation();
  
  const handleUpVote = async () => {
    setLoadingState('updoot-loading');
    await vote({
      postId: post.id,
      value: 1
    });
    setLoadingState('not-loading');
  }
  
  const handleDownVote = async () => {
    setLoadingState('downdoot-loading');
    await vote({
      postId: post.id,
      value: -1
    });
    setLoadingState('not-loading');    
  }

  const handleDeletePost = () => {
    deletePost({ id: post.id });
  }  

  return (
    <Flex p={5} shadow="md" borderWidth="1px">
      <Flex direction="column" align="center" mr={5}>
        <IconButton 
          isLoading={loadingState === 'updoot-loading'}
          aria-label="Upvote post" 
          icon={
            <ChevronUpIcon boxSize="29px" />
          } 
          onClick={handleUpVote}/>
        {post.points}
        <IconButton 
          isLoading={loadingState === 'downdoot-loading'}
          aria-label="Downvote post" 
          icon={ <ChevronDownIcon boxSize="29px" /> } 
          onClick={handleDownVote}/>
      </Flex>

        <Box flex={1}>
          <NextLink href="/post/[id]" as={`/post/${post.id}`}>
            <Link mr={3}> <Heading fontSize="xl">{post.title}</Heading> </Link>
          </NextLink>
            
          <Text>posted by {post.creator.username} {post.id} </Text>
          <Flex mt={4} align="center">
            <Text flex={1}> {post.textSnippet}</Text>

            {!belongsToUser 
              ? null 
              : <Box>
                <NextLink href="/post/edit/[id]" as={`/post/edit/${post.id}`}>
                  <IconButton 
                    mr={2}
                    isLoading={fetching}
                    aria-label="Edit post" 
                    icon={
                      <EditIcon boxSize="20px" />
                    }/>
                </NextLink>

                <IconButton 
                  isLoading={fetching}
                  aria-label="Delete post" 
                  icon={ <DeleteIcon boxSize="20px" /> } 
                  onClick={handleDeletePost}/>
              </Box>}

          </Flex>
        </Box>

    </Flex>
  );  
}

export default PostCard


