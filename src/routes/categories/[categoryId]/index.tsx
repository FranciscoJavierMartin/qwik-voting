import { component$, useComputed$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import type { Question } from '@prisma/client';
import Answers from '~/components/answers';
import prismaClient from '~/lib/prismaClient';
import type { VoteTally } from '~/types';

const getVotes = async (questions: Question[]): Promise<VoteTally[]> =>
  (
    await prismaClient.vote.groupBy({
      where: { questionId: { in: questions.map((q) => q.id) } },
      by: ['questionId', 'answerId'],
      _count: {
        answerId: true,
      },
    })
  ).map(({ questionId, answerId, _count }) => ({
    questionId,
    answerId,
    count: _count.answerId ?? 0,
  }));

export const useGetQuestions = routeLoader$(async ({ params, status }) => {
  const categoryId = parseInt(params.categoryId, 10);
  const category = await prismaClient.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    status(404);
  }

  const questions = await prismaClient.question.findMany({
    where: { categoryId },
    include: { answers: true },
  });

  const votes = await getVotes(questions);

  return { questions, votes };
});

export default component$(() => {
  const questions = useGetQuestions();

  const voteTallies = useComputed$(() => questions.value?.votes ?? []);

  return (
    <>
      {questions.value?.questions.map((question) => (
        <div key={question.id} class='mt-3 mb-6'>
          <div class='text-2xl font-bold mb-3'>{question.question}</div>
          <Answers
            question={question}
            answers={question.answers}
            voteTallies={voteTallies}
          />
        </div>
      ))}
    </>
  );
});
