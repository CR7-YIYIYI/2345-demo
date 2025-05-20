

import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import ZAN_PNG from ".//zan.png";
import "./index.css";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef(null);
  const pageSize = 10;


  const getData = async (isRefresh = false) => {
    if (loading) return;

    const currentPage = isRefresh ? 1 : pageNum;

    setLoading(true);
    if (isRefresh) {
      setRefreshing(true);
    }

    try {
      const res = await axios.get("/api/users/page", {
        params: { pageNum: currentPage, pageSize },
      });

      if (isRefresh) {
        setUsers(res.data.data.list);
      } else {
        setUsers((prev) => [...prev, ...res.data.data.list]);
      }

      setPageNum(currentPage + 1);
      setHasMore(res.data.data.list.length >= pageSize);
    } catch (error) {
      console.error("获取数据失败:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);


  useEffect(() => {
    const container = containerRef.current;
    if (!container || !hasMore) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;

      if (scrollHeight - (scrollTop + clientHeight) < 100 && !loading) {
        getData();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startY = 0;
    let isPullDown = false;

    const handleTouchStart = (e) => {
      startY = e.touches[0].pageY;
    };

    const handleTouchMove = (e) => {
      const y = e.touches[0].pageY;
      const moveY = y - startY;


      if (container.scrollTop === 0 && moveY > 0) {
        isPullDown = true;

        e.preventDefault();
      } else {
        isPullDown = false;
      }
    };

    const handleTouchEnd = (e) => {
      if (isPullDown) {
        getData(true);
      }
      isPullDown = false;
    };

    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);


  const splitIntoColumns = () => {
    const leftColumn = [];
    const rightColumn = [];

    users.forEach((item, index) => {
      if (index % 2 === 0) {
        leftColumn.push(item);
      } else {
        rightColumn.push(item);
      }
    });

    return { leftColumn, rightColumn };
  };

  const { leftColumn, rightColumn } = splitIntoColumns();


  const Box = ({ data }) => {
    const { video, title, meTitle, name, dia, img, ava, isVideo } = data;
    return (
      <div className="box">
        {isVideo ? (
          <div className="video">
            <video playsInline controls width="100%">
              <source src={video} />
            </video>
          </div>
        ) : (
          <div className="img">
            <img width="100%" src={img} alt={title} />
          </div>
        )}
        <div className="content">
          <div className="title">{title}</div>
          <div className="me-title">{meTitle}</div>
          <div className="message">
            <div className="person">
              <img src={ava} alt={name} />
              <div className="name">{name}</div>
            </div>
            <div className="dia">
              <img src={ZAN_PNG} />
              <div>{dia}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="waterfall-container" ref={containerRef}>
      {/* 下拉刷新提示 */}
      {refreshing && (
        <div className="refresh-indicator">
          <div className="refresh-spinner"></div>
          <div>正在刷新...</div>
        </div>
      )}

      <div className="waterfall-wrapper">
        <div className="waterfall-column">
          {leftColumn.map((val, index) => (
            <Box key={`left-${index}`} data={val} />
          ))}
        </div>
        <div className="waterfall-column">
          {rightColumn.map((val, index) => (
            <Box key={`right-${index}`} data={val} />
          ))}
        </div>
      </div>

      {/* 加载更多提示 */}
      {loading && !refreshing && (
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <div>加载中...</div>
        </div>
      )}

      {/* 没有更多数据提示 */}
      {!hasMore && <div className="no-more-data">没有更多数据了</div>}
    </div>
  );
}
