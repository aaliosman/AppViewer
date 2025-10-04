import React from 'react';
const TextFromRichEditor = ({ blocks }) => {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      {blocks.map((content, index) => {
        if (!content) return null;

        switch (content?.type) {
          case 'paragraph':
            return (
              <p key={index} className="">
                {content?.children?.map((item, idx) => (
                  <span
                    key={idx}
                    className={`${item?.bold ? 'font-bold' : ''}`}
                  >
                    {item?.text}
                  </span>
                ))}
              </p>
            );
          case 'list':
            return (
              <ol
                key={index}
                className={
                  content?.format === 'ordered' ? 'list-decimal' : 'list-disc'
                }
                // dir="rtl"
              >
                {content?.children?.map((item, idx) =>
                  item?.children?.map((child, childIdx) => (
                    <li key={childIdx}>{child?.text}</li>
                  ))
                )}
              </ol>
            );
          case 'heading':
            return content?.children?.map((item, idx) => {
              const HeadingTag = `h${content?.level}`;
              const headingStyles = {
                1: 'text-[32px]/[50px] font-bold',
                2: 'text-[24px]/[50px] font-bold',
                3: 'text-[18.72px]/[50px] font-bold',
                4: 'text-[16px]/[50px] font-bold',
                5: 'text-[13.28px]/[50px] font-bold',
                6: 'text-[10.72px]/[50px] font-bold',
              };
              return (
                <HeadingTag className={headingStyles[content?.level]} key={idx}>
                  {item?.text}
                </HeadingTag>
              );
            });
          default:
            return null;
        }
      })}
    </div>
  );
};

export default TextFromRichEditor;
