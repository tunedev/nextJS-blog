import Layout from '../../components/layout';
import { getPostId, getPostDataById } from '../../lib/posts';
import Head from 'next/head';
import Date from '../../components/date';
import utilStyles from '../../styles/utils.module.css';

const Post = ({ post }) => {
  return (
    <Layout>
      <Head>
        <title>{post.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{post.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={post.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.contentHTML }} />
      </article>
    </Layout>
  );
};

export const getStaticPaths = async () => {
  const paths = getPostId();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const postData = await getPostDataById(params.id);
  return {
    props: {
      post: postData,
    },
  };
};

export default Post;
