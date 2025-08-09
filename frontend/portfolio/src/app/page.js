import React from "react";
import Hero from "../components/Hero";
import Navigation from "../components/Navigation";
import About from "../components/About";
import KubernetesCluster from "../components/KubernetesCluster";
import Monitoring from "../components/Monitoring";
import GitOps from "../components/GitOps";
import Ansible from "../components/Ansible";
import { Separator } from "../components/ui/separator";

function Home() {
  return (
    <main id="main-content">
      <Hero />
      <Navigation />
      <About />
      <Separator className="my-16" />
      <KubernetesCluster />
      <Separator className="my-16" />
      <Monitoring />
      <Separator className="my-16" />
      <GitOps />
      <Separator className="my-16" />
      <Ansible />
    </main>
  );
}

export default Home;
