import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remark from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export const getSortedPostsData = () => {
  // Get file names under /posts directory
  const postFiles = fs.readdirSync(postsDirectory);
  const postsData = postFiles.map((postFile) => {
    // remove .md from file name to form post id
    const id = postFile.replace(/\.md$/, '');

    // Read markdown file as strings
    const postFullFilePath = path.join(postsDirectory, postFile);
    const postFileContent = fs.readFileSync(postFullFilePath, 'utf8');

    //  usr grey matter to parse the file content
    const content = matter(postFileContent);

    // return the id and result
    return {
      id,
      ...content.data,
    };
  });

  return postsData.sort(({ date: a }, { date: b }) => {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
  });
};

export const getPostId = () => {
  const postFiles = fs.readdirSync(postsDirectory);

  return postFiles.map((postFile) => {
    const id = postFile.replace(/\.md$/, '');
    return {
      params: {
        id,
      },
    };
  });
};

export const getPostDataById = async (id) => {
  const postFullFilePath = path.join(postsDirectory, `${id}.md`);
  const postFileContent = fs.readFileSync(postFullFilePath, 'utf8');

  const matterContent = matter(postFileContent);

  const processedContent = remark().use(html).process(matterContent.content);
  const contentHTML = (await processedContent).toString();

  return {
    id: id,
    contentHTML,
    ...matterContent.data,
  };
};
