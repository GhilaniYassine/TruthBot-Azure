import { Helmet } from "react-helmet";
import { ChatInterface } from "@/components/ChatInterface";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>TruthBot - AI-Powered Fact-Checking Platform</title>
        <meta 
          name="description" 
          content="Verify claims, expose misinformation, and discover the truth with TruthBot's multi-agent AI system backed by real-time web research." 
        />
      </Helmet>
      <ChatInterface />
    </>
  );
};

export default Index;
