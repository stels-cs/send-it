import * as React from 'react';
import { JSXElementConstructor, ReactElement } from "react";

// eslint-disable-next-line
class ErrorBoundary extends React.Component<{fallback:string, children:ReactElement<any, string | JSXElementConstructor<any>>},{hasError:boolean}> {
  // eslint-disable-next-line
  constructor(props: {fallback:string, children:ReactElement<any, string | JSXElementConstructor<any>>}) {
    super(props);
    this.state = { hasError: false };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(_:unknown) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  // eslint-disable-next-line
  componentDidCatch(error:unknown, info:{componentStack?:any}) {
    console.log(
      error,
      // Example "componentStack":
      //   in ComponentThatThrows (created by App)
      //   in ErrorBoundary (created by App)
      //   in div (created by App)
      //   in App
      info?.componentStack,
    );
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
