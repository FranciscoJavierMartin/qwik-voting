import { component$ } from '@builder.io/qwik';
import { Form, routeAction$, z, zod$ } from '@builder.io/qwik-city';
import prismaClient from '~/lib/prismaClient';

export const useCreateQuestion = routeAction$(
  async (data, { params }) => {
    const question = await prismaClient.question.create({
      data: {
        categoryId: +params.categoryId,
        question: data.question,
      },
    });

    for (const answer of [
      data.answer1,
      data.answer2,
      data.answer3,
      data.answer4,
      data.answer5,
    ].filter(Boolean)) {
      await prismaClient.answer.create({
        data: { questionId: question.id, answer: answer! },
      });
    }

    return question;
  },
  zod$({
    question: z.string(),
    answer1: z.string().optional(),
    answer2: z.string().optional(),
    answer3: z.string().optional(),
    answer4: z.string().optional(),
    answer5: z.string().optional(),
  })
);

export default component$(() => {
  const createQuestion = useCreateQuestion();

  return (
    <div>
      <h1 class='text-3xl'>Create question</h1>
      <Form action={createQuestion} class='flex flex-col'>
        <label>Question</label>
        <input
          name='question'
          value={createQuestion.formData?.get('question')}
          class='input input-bordered'
        />
        <label>Answer 1</label>
        <input
          name='answer1'
          value={createQuestion.formData?.get('answer1')}
          class='input input-bordered'
        />
        <label>Answer 2</label>
        <input
          name='answer2'
          value={createQuestion.formData?.get('answer2')}
          class='input input-bordered'
        />
        <label>Answer 3</label>
        <input
          name='answer3'
          value={createQuestion.formData?.get('answer3')}
          class='input input-bordered'
        />
        <label>Answer 4</label>
        <input
          name='answer4'
          value={createQuestion.formData?.get('answer4')}
          class='input input-bordered'
        />
        <label>Answer 5</label>
        <input
          name='answer5'
          value={createQuestion.formData?.get('answer5')}
          class='input input-bordered'
        />
        <button type='submit' class='btn'>
          Create
        </button>
      </Form>
      {createQuestion.value && (
        <div>
          <h2>Question create successfully</h2>
        </div>
      )}
    </div>
  );
});
