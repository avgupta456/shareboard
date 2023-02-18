"use client";

import { Button } from "@mantine/core";

const Page = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-screen flex items-center justify-center">
      <div className="text-white text-7xl text-center montserrat">
        <h1>ShareBoard</h1>
        <p className="text-3xl mt-8">Instantly share your data dashboards everywhere</p>
        <div className="mt-12">
          <Button component="a" href="/dashboard" className="mr-4" color="dark" size="lg">
            Dashboard
          </Button>
          <Button component="a" href="/auth" variant="light" color="violet" size="lg">
            Sign up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
