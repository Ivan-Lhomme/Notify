import type { UpperBarProps } from "../utils/PropsType";

export default function UpperBar({ setRoute }: UpperBarProps) {
  const home = () => {
    setRoute((route) => {
      return {
        ...route,
        profile: false,
        playlist: false,
      };
    });
  };

  const profile = () => {
    setRoute((route) => {
      return {
        ...route,
        profile: true,
        playlist: false,
      };
    });
  };

  const queue = () => {
    setRoute((route) => {
      return {
        ...route,
        queue: true,
      };
    });
  };

  const actualMusicInfo = () => {
    setRoute((route) => {
      return {
        ...route,
        queue: false,
      };
    });
  };

  return (
    <div>
      <button onClick={home}>🏠</button>
      <input type="search" name="searchBar" id="searchBar" />
      <button onClick={profile}>Profile</button>
      <button onClick={queue}>Queue</button>
      <button onClick={actualMusicInfo}>Music</button>
    </div>
  );
}
