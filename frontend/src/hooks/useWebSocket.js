import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchTasks } from "../redux/slices/taskSlice";

export function useWebSocket() {
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate a task update
      dispatch(fetchTasks());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [dispatch]);
}

export default useWebSocket;
