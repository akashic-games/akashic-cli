// setTimeoutが動作するようにする
jest.useRealTimers();
// タイムアウト時間を60秒に増やしておく
jest.setTimeout(60000);