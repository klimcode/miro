import { css } from "linaria";

export default {
  wrap: css`
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex: auto 1 0;
    flex-wrap: wrap;
    align-content: flex-start;
    width: 100%;
    min-width: 80px;
    height: 100%;
    min-height: 43px;
    padding: 8px 7px;
    overflow-y: auto;
    overflow-x: hidden;
  `,
  wrapBg: css`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  `,
  chip: css`
    position: relative;
    z-index: 1;
    box-sizing: border-box;
    display: block;
    height: 24px;
    max-width: 100%;
    padding-left: 10px;
    padding-right: 24px;
    margin-right: 4px;
    margin-bottom: 2px;
    line-height: 24px;
    overflow: hidden;
    text-overflow: ellipsis;
    background-color: rgba(102, 153, 255, 0.2);
    border: none;
    border-bottom: 1px dashed transparent;
    border-radius: 12px;

    & i {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-style: normal;
      cursor: pointer;
      user-select: none;
    }
    & i:before {
      content: "×";
    }
    & i:hover {
      font-size: 18px;
      font-weight: bold;
    }
  `,
  chipInvalid: css`
    background: none;
    border-color: red;
  `,
  input: css`
    position: relative;
    z-index: 1;
    display: block;
    height: 24px;
    max-width: calc(100% - 20px);
    margin: 0 10px;
    line-height: 24px;

    & i {
      display: block;
      min-width: 20px;
      margin-right: 16px;
      visibility: hidden;
      font-style: normal;
    }
    & input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: inherit;
      padding: 0;
      margin: 0;
      font-size: inherit;
      font-family: inherit;
      line-height: inherit;
      background: none;
      border: none;
    }
    & input:focus {
      outline: none;
    }
  `
};
