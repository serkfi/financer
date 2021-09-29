import React, { useState, useEffect } from "react";
import Banner from "../../components/banner/banner";
import BannerText from "../../components/banner/banner.text";
import Button from "../../components/button/button";
import Loader from "../../components/loader/loader";
import SEO from "../../components/seo/seo";
import TransactionStackedList from "../../components/transaction-stacked-list/transaction-stacked-list";
import monthNames from "../../constants/months";
import formatCurrency from "../../utils/formatCurrency";
import { IIncomesPerMonth } from "../income/IncomeFuctions";
import {
  ITransfersPerMonth,
  sortIncomeStacksByMonth,
  sortIncomesByDate,
  groupTransfersByMonth,
} from "./TransferFuctions";
import { getAllTransferTranscations } from "./TransferService";

const Transfers = (): JSX.Element => {
  const [transfersRaw, setTransfersRaw] = useState<ITransaction[] | null>(null);
  const [transfers, setTransfers] = useState<ITransfersPerMonth[]>([]);

  useEffect(() => {
    const fetchTransfers = async () => {
      setTransfersRaw((await getAllTransferTranscations()).payload);
    };

    fetchTransfers();
  }, []);

  useEffect(() => {
    if (transfersRaw === null) return;

    setTransfers(
      transfersRaw
        .reduce<IIncomesPerMonth[]>(groupTransfersByMonth, [])
        .sort(sortIncomeStacksByMonth)
        .map(sortIncomesByDate)
    );
  }, [transfersRaw]);

  return transfersRaw === null ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <SEO title="Transfers" />
      <Banner title="Transfers" headindType="h1" className="mb-8">
        <BannerText>Overview page for your transfer transactions.</BannerText>
        <Button link="/statistics/transfers/add" className="mt-6">
          Add transfer
        </Button>
      </Banner>
      {transfers.map(({ year, month, rows, total }) => (
        <section
          className="mb-12"
          aria-label={`IOverview of income transactions for ${monthNames[month]}, ${year}`}
        >
          <div className="grid grid-cols-[1fr,auto] gap-4 items-end justify-between sticky top-0 z-10 bg-white-off py-4 -mt-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter truncate">
              {`${monthNames[month]}, ${year}`}
            </h2>
            <p className="font-semibold text-gray-600">
              <span className="sr-only">Total: </span>
              {Number.isNaN(total) ? "-" : formatCurrency(total)}
            </p>
          </div>
          <TransactionStackedList rows={rows} />
        </section>
      ))}
    </>
  );
};

export default Transfers;
