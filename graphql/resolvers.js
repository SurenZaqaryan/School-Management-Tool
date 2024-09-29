import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const resolvers = {
  Query: {
    getTeacher: async (_, { id }, { prisma }) => {
      return await prisma.teacher.findUnique({
        where: { id: String(id) },
        include: { subjects: true },
      });
    },
    getTeachers: async (_, args, context) => {
      return await context.prisma.teacher.findMany({
        include: { subjects: true },
      });
    },
    getPupils: async (_, args, context) => {
      return await context.prisma.pupil.findMany({
        include: { subjects: true },
      });
    },
    getSubjects: async (_, args, context) => {
      return await context.prisma.subject.findMany({
        include: { teachers: true },
      });
    },
  },

  Mutation: {
    // login
    signup: async (_, { email, password }, { prisma }) => {
      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      return {
        message: 'success',
      };
    },
    login: async (_, { email, password }, { prisma }) => {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        throw new Error('Invalid password');
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: '5h',
      });

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    },

    // teacher
    addTeacher: async (_, { name, subjectIds }, { prisma }) => {
      const newTeacher = await prisma.teacher.create({
        data: {
          name,
          subjects: {
            connect: subjectIds.map((subjectId) => ({ id: String(subjectId) })),
          },
        },
        include: { subjects: true },
      });

      return newTeacher;
    },
    updateTeacher: async (_, { id, name, subjectIds }, { prisma }) => {
      const updatedTeacher = await prisma.teacher.update({
        where: { id: String(id) },
        data: {
          name,
          subjects: {
            set: subjectIds.map((subjectId) => ({ id: String(subjectId) })),
          },
        },
        include: { subjects: true },
      });
      return updatedTeacher;
    },

    deleteTeacher: async (_, { id }, { prisma }) => {
      try {
        await prisma.teacher.delete({
          where: {
            id: String(id),
          },
        });
        return true;
      } catch (err) {
        console.error('Error:', err);
        return false;
      }
    },
    // pupil
    addPupil: async (parent, { name, grade, subjectIds }, context) => {
      const pupil = await context.prisma.pupil.create({
        data: {
          name,
          grade,
          subjects: {
            connect: subjectIds.map((id) => ({ id })),
          },
        },
        include: {
          subjects: true,
        },
      });
      return true;
    },
    updatePupil: async (parent, { id, name, grade, subjectIds }, { prisma }) => {
      const updatedPupil = await prisma.pupil.update({
        where: { id: String(id) },
        data: {
          name,
          grade,
          subjects: {
            set: subjectIds.map((subjectId) => ({ id: String(subjectId) })),
          },
        },
        include: {
          subjects: true,
        },
      });
      return updatedPupil;
    },
    deletePupil: async (parent, { id }, context) => {
      await context.prisma.pupil.delete({ where: { id } });
      return true;
    },

    // subject
    addSubject: async (parent, { name }, context) => {
      return await context.prisma.subject.create({
        data: { name },
      });
    },
    updateSubject: async (parent, { id, name }, context) => {
      return await context.prisma.subject.update({
        where: { id },
        data: { name },
      });
    },
    deleteSubject: async (parent, { id }, context) => {
      await context.prisma.subject.delete({ where: { id } });
      return true;
    },
  },
};

export default resolvers;
