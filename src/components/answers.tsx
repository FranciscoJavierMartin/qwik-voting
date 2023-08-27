import { type Signal, component$ } from '@builder.io/qwik';
import type { Answer, Question } from '@prisma/client';
import type { VoteTally } from '~/types';

export default component$<{
  question: Question;
  answers: Answer[];
  voteTallies: Signal<VoteTally[]>;
}>(({ question, answers, voteTallies }) => {
  return (
    <div class='px-5 grid grid-cols-[40%_25%_25%_10%] gap-2'>
      {answers.map((answer) => {
        const votes =
          voteTallies.value.find(({ answerId }) => answerId === answer.id)
            ?.count ?? 0;

        const totalVotes = voteTallies.value
          .filter(({ questionId }) => questionId === question.id)
          .reduce((acc, { count }) => acc + (count ?? 0), 0);

        return (
          <>
            <div>{answer.answer}</div>
            <div class='flex justify-center'></div>
            <div>
              <progress
                class='progress progress-error w-full'
                value={Math.round((votes / totalVotes) * 100) || 0}
                max='100'
              />
            </div>
            <div>{votes} votes</div>
          </>
        );
      })}
    </div>
  );
});
