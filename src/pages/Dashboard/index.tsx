import React, { useState, useEffect, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import incomeimg from '../../assets/income.svg';
import outcomeimg from '../../assets/outcome.svg';
import totalimg from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
  formattedIncome?: string;
  formattedOutcome?: string;
  formattedTotal?: string;
}

interface Response {
  transactions: Transaction[];
  balance: Balance;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get<Response>('/transactions');

      const { income, outcome, total } = response.data.balance;

      const balanceData = {
        ...response.data.balance,
        formattedIncome: formatValue(Number(income)),
        formattedOutcome: formatValue(Number(outcome)),
        formattedTotal: formatValue(Number(total)),
      };

      const transactionsData = response.data.transactions.map(transaction => ({
        ...transaction,
        formattedDate: format(new Date(transaction.created_at), 'dd/MM/yyyy'),
        formattedValue: formatValue(transaction.value),
      }));

      setTransactions(transactionsData);
      setBalance(balanceData);
    }

    loadTransactions();
  }, []);

  const renderTransactions = useMemo(
    () =>
      transactions.map(transaction => (
        <tr key={transaction.id}>
          <td className="title">{transaction.title}</td>
          <td className={transaction.type}>
            {transaction.type === 'outcome' && '- '}
            {transaction.formattedValue}
          </td>
          <td>{transaction.category.title}</td>
          <td>{transaction.formattedDate}</td>
        </tr>
      )),
    [transactions],
  );

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={incomeimg} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.formattedIncome}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcomeimg} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.formattedOutcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={totalimg} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.formattedTotal}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>{renderTransactions}</tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
