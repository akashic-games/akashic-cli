// setTimeoutが動作するようにする
jest.useRealTimers();
// タイムアウト時間を20秒に増やしておく
jest.setTimeout(20000);