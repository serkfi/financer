import React from "react";
import Button from "../../components/button/button";
import ButtonGroup from "../../components/button/button.group";
import Container from "../../components/container/container";
import DashboardStats from "../../components/dashboard-stats/dashboard.stats";
import Hero from "../../components/hero/hero";
import HeroLead from "../../components/hero/hero.lead";
import SEO from "../../components/seo/seo";

const Dashboard = (): JSX.Element => {
  return (
    <>
      <SEO title="Dashboard" />
      <Hero accent="Your" accentColor="pink" label="Dashboard">
        <HeroLead>
          Below you are able to see summaries of your added accounts, income and
          expenses.
        </HeroLead>
        <ButtonGroup className="mt-12">
          <Button accentColor="green" link="/incomes/add">
            Add income
          </Button>
          <Button accentColor="red" link="/expenses/add">
            Add expense
          </Button>
          <Button accentColor="blue" link="/accounts/transfer">
            Transfer
          </Button>
        </ButtonGroup>
      </Hero>
      <DashboardStats className="mt-12" label="Current month" />
    </>
  );
};

export default Dashboard;
