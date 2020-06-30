import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import styles from './YoutubeList.module.css';

const ItemWrapper = styled.article`
  display: flex;
  margintop: 10px;
  cursor: pointer;
  padding: 5px 0;
`;

const ItemImage = styled.img`
  width: 100px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 100%;
  text-align: center;
  margin-left: 8px;
`;

const YoutubeListItem = ({ image, alt, title, id, onClick }) => (
  <ItemWrapper className={styles.itemWrapper} onClick={() => onClick(id)}>
    <div>
      <ItemImage src={image} alt={alt} />
    </div>
    <ContentWrapper>
      <div>{title}</div>
    </ContentWrapper>
  </ItemWrapper>
);

const YoutubeList = ({ searches, onClick }) => (
  <div style={{ height: 'calc(100% - 40px)', overflowY: 'auto' }}>
    {searches.map((search, index) => (
      <YoutubeListItem
        image={search.snippet.thumbnails.default.url}
        alt={`${search.snippet.title} Image`}
        title={search.snippet.title}
        onClick={onClick}
        id={search.id.videoId}
        key={index}
      />
    ))}
  </div>
);

YoutubeListItem.propTypes = {
  image: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  id: PropTypes.string,
  onClick: PropTypes.func,
};

YoutubeList.propTypes = {
  searches: PropTypes.array,
  onClick: PropTypes.func,
};

export default YoutubeList;
