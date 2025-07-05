import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../redux/slices/taskSlice";
import { fetchNotifications } from "../redux/slices/notificationSlice";
import useWebSocket from "react-use-websocket";

function useAppWebSocket() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = localStorage.getItem("access");

  const taskSocketUrl = `ws://localhost:8000/ws/tasks/?token=${token}`;
  const notificationSocketUrl = `ws://localhost:8000/ws/notifications/?token=${token}`;

  // Always call useWebSocket unconditionally
  const { lastJsonMessage: taskMessage } = useWebSocket(taskSocketUrl, {
    shouldReconnect: () => true,
    retryOnError: true,
    share: true,
    // prevents connection if no user/token
    skip: !user || !token,
  });

  const { lastJsonMessage: notificationMessage } = useWebSocket(
    notificationSocketUrl,
    {
      shouldReconnect: () => true,
      retryOnError: true,
      share: true,
      skip: !user || !token,
    }
  );

  useEffect(() => {
    if (taskMessage) dispatch(fetchTasks());
  }, [taskMessage, dispatch]);

  useEffect(() => {
    if (notificationMessage) dispatch(fetchNotifications());
  }, [notificationMessage, dispatch]);
}

export default useAppWebSocket;
