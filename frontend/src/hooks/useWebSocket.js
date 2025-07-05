import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../redux/slices/taskSlice";
import { fetchNotifications } from "../redux/slices/notificationSlice";
import useWebSocket from "react-use-websocket";

export function useWebSocket() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = localStorage.getItem("access");

  const taskSocketUrl = user
    ? `ws://localhost:8000/ws/tasks/?token=${token}`
    : null;
  const notificationSocketUrl = user
    ? `ws://localhost:8000/ws/notifications/?token=${token}`
    : null;

  const { lastJsonMessage: taskMessage } = useWebSocket(taskSocketUrl, {
    shouldReconnect: () => true,
    queryParams: { token },
  });

  const { lastJsonMessage: notificationMessage } = useWebSocket(
    notificationSocketUrl,
    {
      shouldReconnect: () => true,
      queryParams: { token },
    }
  );

  useEffect(() => {
    if (taskMessage) {
      dispatch(fetchTasks());
    }
  }, [taskMessage, dispatch]);

  useEffect(() => {
    if (notificationMessage) {
      dispatch(fetchNotifications());
    }
  }, [notificationMessage, dispatch]);

  return null;
}

export default useWebSocket;
