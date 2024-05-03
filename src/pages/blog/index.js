import React, { useEffect, useState, useMemo } from "react";
import Layout from "../../components/layout";
import { useStaticQuery, graphql } from "gatsby";
import { getImage } from "gatsby-plugin-image";
import { FaFilter } from "react-icons/fa";
import {
  Card,
  Select,
  AreaSelectButton,
  AreaBlock,
  useFilterSelect,
  useNotFoundItems,
  useFilteredAndSortedPosts,
} from "../../components/blogPage/index";
import { dateAscendingOptions } from "../../constants/selections";

const BlogPage = ({ location }) => {
  const {
    allMdx: { nodes },
    allContentfulAuthor: { nodes: authors },
  } = useStaticQuery(graphql`
    query {
      allMdx {
        nodes {
          frontmatter {
            category
            subcategory
            author
            date(formatString: "YYYY/MM/DD")
            hero_image {
              childImageSharp {
                gatsbyImageData(placeholder: BLURRED, width: 300)
              }
            }
            slug
            tags
            title
          }
          excerpt
        }
      }
      allContentfulAuthor {
        nodes {
          image {
            gatsbyImageData(placeholder: BLURRED)
          }
          name
        }
      }
    }
  `);
  const authorToImageMap = Object.fromEntries(
    authors.map((author) => {
      return [author.name, getImage(author.image)];
    })
  );
  const allPosts = useMemo(
    () =>
      nodes.map((node) => {
        return {
          ...node.frontmatter,
          hero_image: getImage(node.frontmatter.hero_image),
          excerpt: node.excerpt,
        };
      }),
    [nodes]
  );
  const categoryToSubcategoryToTagsMap = useMemo(
    () =>
      allPosts.reduce(
        (accumulator, currentPost) => {
          const {
            category: currentPostCategory,
            subcategory: currentPostSubcategory,
            tags: currentPostTags,
          } = currentPost;
          accumulator["numOfPosts"] += 1;
          if (!accumulator["categories"].hasOwnProperty(currentPostCategory)) {
            accumulator["categories"][currentPostCategory] = {
              numOfPosts: 1,
              tags: currentPostTags,
              subcategories: {
                [currentPostSubcategory]: {
                  numOfPosts: 1,
                  tags: currentPostTags,
                },
              },
            };
          } else {
            accumulator["categories"][currentPostCategory]["tags"] = [
              ...new Set([
                ...accumulator["categories"][currentPostCategory]["tags"],
                ...currentPostTags,
              ]),
            ];
            if (
              !accumulator["categories"][currentPostCategory][
                "subcategories"
              ].hasOwnProperty(currentPostSubcategory)
            ) {
              accumulator["categories"][currentPostCategory]["subcategories"][
                currentPostSubcategory
              ] = {
                numOfPosts: 1,
                tags: currentPostTags,
              };
            } else {
              accumulator["categories"][currentPostCategory]["subcategories"][
                currentPostSubcategory
              ]["numOfPosts"] += 1;
              accumulator["categories"][currentPostCategory]["subcategories"][
                currentPostSubcategory
              ]["tags"] = [
                ...new Set([
                  ...accumulator["categories"][currentPostCategory][
                    "subcategories"
                  ][currentPostSubcategory]["tags"],
                  ...currentPostTags,
                ]),
              ];
            }
            accumulator["categories"][currentPostCategory]["numOfPosts"] += 1;
          }
          return accumulator;
        },
        { numOfPosts: 0, categories: {} }
      ),
    [allPosts]
  );
  // console.log(categoryToSubcategoryToTagsMap);

  const { categories } = categoryToSubcategoryToTagsMap;
  const categoryToNumOfPostsMap = useMemo(() => {
    return Object.fromEntries(
      Object.entries(categories).map(([key, value]) => [key, value.numOfPosts])
    );
  }, [categories]);

  const subcategoryToNumOfPostsMap = useMemo(() => {
    const subcategoryMap = {};
    for (const [key, value] of Object.entries(
      categoryToSubcategoryToTagsMap.categories
    )) {
      for (const [subkey, subvalue] of Object.entries(value.subcategories)) {
        subcategoryMap[subkey] = subvalue.numOfPosts;
      }
    }
    return subcategoryMap;
  }, [categoryToSubcategoryToTagsMap.categories]);

  const allTags = useMemo(() => {
    return [
      ...new Set(
        Object.values(categoryToSubcategoryToTagsMap.categories).flatMap(
          (category) => category.tags
        )
      ),
    ];
  }, [categoryToSubcategoryToTagsMap.categories]);
  const [isDateAscending, setIsDateAscending] = useState(false);
  const [targetCategories, setTargetCategories, handleCategorySelect] =
    useFilterSelect([]);
  const [targetSubcategories, setTargetSubcategories, handleSubcategorySelect] =
    useFilterSelect([]);
  const [targetTags, setTargetTags, handleTagSelect] = useFilterSelect([]);
  const posts = useFilteredAndSortedPosts(
    allPosts,
    targetCategories,
    targetSubcategories,
    targetTags,
    isDateAscending
  );
  const { notFoundCategories, notFoundSubcategories, notFoundTags } =
    useNotFoundItems(
      posts,
      targetCategories,
      targetSubcategories,
      targetTags,
      allTags,
      allPosts,
      categoryToNumOfPostsMap,
      subcategoryToNumOfPostsMap
    );
  console.log(notFoundCategories, notFoundSubcategories, notFoundTags);
  const [categoryOptions, setCategoryOptions] = useState(
    Object.keys(categoryToNumOfPostsMap)
  );
  const [subcategoryOptions, setSubcategoryOptions] = useState(
    Object.keys(subcategoryToNumOfPostsMap)
  );
  const [tagOptions, setTagOptions] = useState(allTags);
  const [area, setArea] = useState("category");
  const handleDateSortSelect = (e) => {
    setIsDateAscending(e.target.value === "true");
  };

  useEffect(() => {
    const selectedTag = location?.state?.selectedTag;
    if (selectedTag !== undefined) {
      setTargetTags([selectedTag]);
    }
  }, [location]);

  const handleFilterArea = (area) => {
    setArea(area);
  };
  return (
    <Layout isBlogPost={false}>
      <section className="max-container padding-x pt-32">
        <div className="my-5">
          <Select
            options={dateAscendingOptions}
            handleSelect={handleDateSortSelect}
            defaultValue={isDateAscending}
          />
        </div>
        <div className="flex flex-center items-start gap-5">
          <main className="flex flex-col justify-start gap-4 w-full">
            {posts.length == 0
              ? "無內容"
              : posts.map((post) => {
                  return (
                    <Card
                      key={post.slug}
                      author_image={authorToImageMap[post.author]}
                      {...post}
                    />
                  );
                })}
          </main>
          <aside className="shrink-0 w-[300px] p-3 border-[1px] rounded-lg max-xl:hidden">
            <h2 className="text-lg font-semibold mb-2">篩選內容</h2>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <AreaSelectButton
                area={area}
                label="category"
                labelName="類別"
                targetOptions={targetCategories}
                handleFilterArea={handleFilterArea}
              />
              <AreaSelectButton
                area={area}
                label="subcategory"
                labelName="子類別"
                targetOptions={targetSubcategories}
                handleFilterArea={handleFilterArea}
              />
              <AreaSelectButton
                area={area}
                label="tags"
                labelName="標籤"
                targetOptions={targetTags}
                handleFilterArea={handleFilterArea}
              />
            </div>
            <hr className="mb-3" />
            <AreaBlock
              area={area}
              label="category"
              targetOptions={targetCategories}
              options={categoryOptions}
              notFoundOptions={notFoundCategories}
              handleAreaSelect={handleCategorySelect}
            />
            <AreaBlock
              area={area}
              label="subcategory"
              targetOptions={targetSubcategories}
              options={subcategoryOptions}
              notFoundOptions={notFoundSubcategories}
              handleAreaSelect={handleSubcategorySelect}
            />
            <AreaBlock
              area={area}
              label="tags"
              targetOptions={targetTags}
              options={tagOptions}
              notFoundOptions={notFoundTags}
              handleAreaSelect={handleTagSelect}
            />
          </aside>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPage;
